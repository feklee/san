using System;
using System.Threading;
using System.Text;
using Grasshopper.Kernel;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using System.Drawing;
using Grasshopper;
using Grasshopper.Kernel.Types;
using Newtonsoft.Json;
using Rhino.Geometry;
using System.Threading.Tasks;
using System.Net.WebSockets;

namespace SAN
{
    public delegate void ExpireSolutionDelegate(Boolean recompute);

    public class GraphMessageData
    {
        public string type;
        public List<string> nodeIds;
        public List<List<double>> points;
        public List<List<double>> axes;
        public List<List<List<double>>> lines;
        public List<List<List<int>>> colors;
        public String connectionType;
    };

    public class Graph : GH_Component
    {
        private Connection connection;
        private string message;
        private string url;
        private bool messageIsComplete = false;
        private CancellationTokenSource receiveCTSource;
        private CancellationTokenSource connectCTSource;
        private CancellationTokenSource closeCTSource;
        private Task receiveTask;
        private bool receivingMessage = false;
        private string lastUnreportedErrorMessage = "";

        private void reportError(string errorMessage)
        {
            lastUnreportedErrorMessage = errorMessage;
            expireSolution();
        }

        /// <summary>
        /// Initializes a new instance of the MyComponent1 class.
        /// </summary>
        public Graph() : base("Graph", "Graph", "3D representation of the network", "SAN", "Graph")
        {
            receiveCTSource = new CancellationTokenSource();
            connectCTSource = new CancellationTokenSource();
            closeCTSource = new CancellationTokenSource();
            connection = new Connection();
        }

        /// <summary>
        /// Registers all the input parameters for this component.
        /// </summary>
        protected override void RegisterInputParams(GH_Component.GH_InputParamManager pManager)
        {
            pManager.AddTextParameter("URL", "U", "URL of WebSocket", GH_ParamAccess.item, "ws://san:8080");
        }

        /// <summary>
        /// Registers all the output parameters for this component.
        /// </summary>
        protected override void RegisterOutputParams(GH_Component.GH_OutputParamManager pManager)
        {
            pManager.AddTextParameter("State", "S", "WebSocket state", GH_ParamAccess.item);
            pManager.AddTextParameter("IDs", "I", "Node IDs", GH_ParamAccess.list);
            pManager.AddPointParameter("Points", "P", "Points at node locations", GH_ParamAccess.list);
            pManager.AddVectorParameter("Axes", "A", "Axes defining orientation of nodes", GH_ParamAccess.list);
            pManager.AddLineParameter("Lines", "L", "Lines along edges", GH_ParamAccess.list);
            pManager.AddColourParameter("Colors", "C", "Four colors for each node", GH_ParamAccess.tree);
            pManager.AddParameter(new TriStateParameter(), "Test3", "T3", "My test #3", GH_ParamAccess.item);
            pManager.AddParameter(new ConnectionParameter(), "Connection", "Con", "Connection to SAN", GH_ParamAccess.item);
        }

        private string valueInMessage(string message, string key)
        {
            Regex rx = new Regex(@"""" + key + @""":""([^""]*)""");
            Match match = rx.Match(message);
            if (!match.Success) { return ""; }
            GroupCollection groups = match.Groups;
            return groups[1].Value;
        }

        private string typeOfMessage(string message)
        {
            return valueInMessage(message, "type");
        }

        private void parseGraphMessage(string message, IGH_DataAccess DA)
        {
            var settings = new JsonSerializerSettings
            {
                ObjectCreationHandling = ObjectCreationHandling.Replace
            };
            var graphMessageData = JsonConvert.DeserializeObject<GraphMessageData>(message, settings);
            connection.graphMessageData = graphMessageData;

            var points = new List<GH_Point>();
            foreach (var point in graphMessageData.points)
            {
                var p = new Point3d(point[0], point[1], point[2]);
                points.Add(new GH_Point(p));
            }

            var axes = new List<GH_Vector>();
            foreach (var axis in graphMessageData.axes)
            {
                var v = new Vector3d(axis[0], axis[1], axis[2]);
                axes.Add(new GH_Vector(v));
            }

            var lines = new List<GH_Line>();
            foreach (var edgeLine in graphMessageData.lines)
            {
                var pA = new Point3d(edgeLine[0][0], edgeLine[0][1], edgeLine[0][2]);
                var pB = new Point3d(edgeLine[1][0], edgeLine[1][1], edgeLine[1][2]);
                var l = new Line(pA, pB);
                lines.Add(new GH_Line(l));
            }

            var colors = new DataTree<GH_Colour>();
            var pathIndex = 0;
            foreach (var colorsOfNodeToConvert in graphMessageData.colors)
            {
                var colorsOfNode = new List<GH_Colour>();
                foreach (var colorToConvert in colorsOfNodeToConvert)
                {
                    var color = Color.FromArgb(colorToConvert[0], colorToConvert[1], colorToConvert[2]);
                    colorsOfNode.Add(new GH_Colour(color));
                }
                colors.AddRange(colorsOfNode, new Grasshopper.Kernel.Data.GH_Path(pathIndex));
                pathIndex++;
            }

            DA.SetDataList(1, graphMessageData.nodeIds);
            DA.SetDataList(2, points);
            DA.SetDataList(3, axes);
            DA.SetDataList(4, lines);
            DA.SetDataTree(5, colors);
        }

        private void parseMessage(IGH_DataAccess DA)
        {
            if (!messageIsComplete) {
                return;
            }
            if (typeOfMessage(message) == "graph")
            {
                parseGraphMessage(message, DA);
            }
        }

        private void expireSolution()
        {
            var d = new ExpireSolutionDelegate(ExpireSolution);
            Rhino.RhinoApp.InvokeOnUiThread(d, true);
        }

        private void parseWebSocketBuffer(WebSocketReceiveResult receiveResult, ArraySegment<byte> buffer, IGH_DataAccess DA)
        {
            if (receiveResult.MessageType != WebSocketMessageType.Text) {
                message = "";
                return;
            }

            string messageFragment = Encoding.UTF8.GetString(buffer.Array, 0, receiveResult.Count);
            message += messageFragment;
            messageIsComplete = receiveResult.EndOfMessage;
            if (messageIsComplete) {
                if (typeOfMessage(message) == "graph") {
                    receivingMessage = false;
                    expireSolution();
                    return;
                }
                message = "";
            }
            receiveNextMessage(DA);
        }

        private void receiveNextMessage(IGH_DataAccess DA)
        {
            byte[] byteArray = new byte[65536];
            var buffer = new ArraySegment<byte>(byteArray, 0, byteArray.Length);
            receivingMessage = true;
            try
            {
                receiveTask = connection.webSocket.ReceiveAsync(buffer, receiveCTSource.Token).ContinueWith(res =>
                {
                    try
                    {
                        parseWebSocketBuffer(res.Result, buffer, DA);
                    }
                    catch (Exception ex)
                    {
                        reportError(ex.Message);
                    }
                });
            }
            catch (Exception ex)
            {
                reportError(ex.Message);
            }
        }

        private void publishState(IGH_DataAccess DA)
        {
            string state = (connection.webSocket == null) ? "Not connected" : connection.webSocket.State.ToString();
            if (connection.webSocket != null &&
                connection.webSocket.State != WebSocketState.Open &&
                connection.webSocket.State != WebSocketState.Connecting)
            {
                state += ": " + lastUnreportedErrorMessage;
            }
            DA.SetData(0, state);
            lastUnreportedErrorMessage = "";
        }

        private async void connect(IGH_DataAccess DA)
        {
            Uri uri = new Uri(url);

            try
            {
                connection.webSocket = new ClientWebSocket();
                await connection.webSocket.ConnectAsync(uri, connectCTSource.Token);
            }
            catch (Exception ex)
            {
                reportError(ex.Message);
                return;
            }

            publishState(DA);

            while (connection.webSocket.State != WebSocketState.Open)
            {
                await Task.Delay(500);
            }

            publishState(DA);

            receiveNextMessage(DA);
        }

        private async void disconnect(IGH_DataAccess DA)
        {
            try
            {
                await connection.webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Disconnect", closeCTSource.Token);
            }
            catch (Exception ex)
            {
                reportError(ex.Message);
            }
        }

        private void refreshUrl(IGH_DataAccess DA)
        {
            string newUrl = "";
            DA.GetData(0, ref newUrl);
            if (newUrl != url)
            {
                url = newUrl;
                disconnect(DA);
            }
        }

        /// <summary>
        /// This is the method that actually does the work.
        /// </summary>
        /// <param name="DA">The DA object is used to retrieve from inputs and store in outputs.</param>
        protected override void SolveInstance(IGH_DataAccess DA)
        {
            publishState(DA);
            parseMessage(DA);
            message = "";
            refreshUrl(DA);

            if (connection.webSocket == null || connection.webSocket.State != WebSocketState.Open)
            {
                connect(DA);
            }
            else
            {
                if (!receivingMessage)
                {
                    receiveNextMessage(DA);
                }
            }

            var t = new TriStateType(0);
            DA.SetData(6, t);
            var c = new ConnectionType(connection);
            DA.SetData(7, c);
        }

        /// <summary>
        /// Provides an Icon for the component.
        /// </summary>
        protected override System.Drawing.Bitmap Icon
        {
            get
            {
                //You can add image files to your project resources and access them like this:
                // return Resources.IconForThisComponent;
                return null;
            }
        }

        /// <summary>
        /// Gets the unique ID for this component. Do not change this ID after release.
        /// </summary>
        public override Guid ComponentGuid
        {
            get { return new Guid("f181b7f7-ea24-477f-bab4-82553700e9a4"); }
        }
    }
}