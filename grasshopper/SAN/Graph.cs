using System;
using System.Net.WebSockets;
using System.Threading;
using System.Text;
using System.Diagnostics;
using Grasshopper.Kernel;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using System.Drawing;
using Grasshopper;
using Grasshopper.Kernel.Types;
using Newtonsoft.Json;
using Rhino.Geometry;
using System.Threading.Tasks;

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
    };

    public class Graph : GH_Component
    {
        private ClientWebSocket webSocket;
        private string message;
        private bool messageIsComplete = false;
        private long numberOfReceivedMessages;

        /// <summary>
        /// Initializes a new instance of the MyComponent1 class.
        /// </summary>
        public Graph()
          : base("Graph", "graph", "Graph showing what has been built", "SAN", "Graph")
        {
        }

        /// <summary>
        /// Registers all the input parameters for this component.
        /// </summary>
        protected override void RegisterInputParams(GH_Component.GH_InputParamManager pManager)
        {
        }

        /// <summary>
        /// Registers all the output parameters for this component.
        /// </summary>
        protected override void RegisterOutputParams(GH_Component.GH_OutputParamManager pManager)
        {
            pManager.AddTextParameter("State", "state", "WebSocket state", GH_ParamAccess.item);
            pManager.AddTextParameter("MessageType", "messageType", "Type of received message", GH_ParamAccess.item);
            pManager.AddTextParameter("Message", "message", "Received message", GH_ParamAccess.item);
            pManager.AddTextParameter("Buffer", "buffer", "Buffer of received message", GH_ParamAccess.item);
            pManager.AddTextParameter("Type", "type", "Value of \"type\" field in message", GH_ParamAccess.item);
            pManager.AddTextParameter("Text", "text", "Value of \"text\" field in message", GH_ParamAccess.item);
            pManager.AddIntegerParameter("NumberOfReceivedMessages", "#", "Number of received messages", GH_ParamAccess.item);
            pManager.AddTextParameter("GraphDataMessage", "GraphDataMessage", "Latest GraphData message", GH_ParamAccess.item);
            pManager.AddTextParameter("NodeIds", "nodeIds", "Node IDs", GH_ParamAccess.list);
            pManager.AddPointParameter("NodePoints", "nodePoints", "Points at node locations", GH_ParamAccess.list);
            pManager.AddVectorParameter("Axes", "A", "Axes defining orientation of nodes", GH_ParamAccess.list);
            pManager.AddLineParameter("EdgeLines", "edgeLines", "Lines along edges", GH_ParamAccess.list);
            pManager.AddColourParameter("Colors", "colors", "Four colors for each node", GH_ParamAccess.tree);
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

            var nodePoints = new List<GH_Point>();
            foreach (var point in graphMessageData.points)
            {
                var p = new Point3d(point[0], point[1], point[2]);
                nodePoints.Add(new GH_Point(p));
            }

            var axes = new List<GH_Vector>();
            foreach (var axis in graphMessageData.axes)
            {
                var v = new Vector3d(axis[0], axis[1], axis[2]);
                axes.Add(new GH_Vector(v));
            }

            var edgeLines = new List<GH_Line>();
            foreach (var edgeLine in graphMessageData.lines)
            {
                var pA = new Point3d(edgeLine[0][0], edgeLine[0][1], edgeLine[0][2]);
                var pB = new Point3d(edgeLine[1][0], edgeLine[1][1], edgeLine[1][2]);
                var l = new Line(pA, pB);
                edgeLines.Add(new GH_Line(l));
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

            DA.SetData(7, message);
            DA.SetDataList(8, graphMessageData.nodeIds);
            DA.SetDataList(9, nodePoints);
            DA.SetDataList(10, axes);
            DA.SetDataList(11, edgeLines);
            DA.SetDataTree(12, colors);
        }

        private void parseMessage(IGH_DataAccess DA)
        {
            if (!messageIsComplete) { return; }
            DA.SetData(3, message);
            DA.SetData(6, numberOfReceivedMessages);
            if (typeOfMessage(message) == "graph") {
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
            DA.SetData(1, receiveResult.MessageType);
            if (receiveResult.MessageType != WebSocketMessageType.Text) {
                message = "";
                return;
            }

            DA.SetData(2, buffer.ToString());
            string messageFragment = Encoding.UTF8.GetString(buffer.Array, 0, receiveResult.Count);
            message += messageFragment;
            messageIsComplete = receiveResult.EndOfMessage;
            if (messageIsComplete)
            {
                numberOfReceivedMessages++;
                DA.SetData(6, numberOfReceivedMessages);
                if (typeOfMessage(message) == "graph")
                {
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
            webSocket.ReceiveAsync(buffer, CancellationToken.None).ContinueWith(res =>
            {
                parseWebSocketBuffer(res.Result, buffer, DA);
            });
        }

        private void publishStatus(IGH_DataAccess DA)
        {
            string status = (webSocket == null) ? "Not connected" : webSocket.State.ToString();
            DA.SetData(0, status);
        }

        private async void connect(IGH_DataAccess DA)
        {
            Uri uri = new Uri("ws://felix-arch:8080");

            try
            {
                webSocket = new ClientWebSocket();
                await webSocket.ConnectAsync(uri, CancellationToken.None);
            }
            catch (Exception ex)
            {
                DA.SetData(0, ex.ToString()); // TODO: put in other field
            }

            publishStatus(DA);

            while (webSocket.State != WebSocketState.Open)
            {
                await Task.Delay(500);
            }

            publishStatus(DA);

            receiveNextMessage(DA);
        }

        /// <summary>
        /// This is the method that actually does the work.
        /// </summary>
        /// <param name="DA">The DA object is used to retrieve from inputs and store in outputs.</param>
        protected override void SolveInstance(IGH_DataAccess DA)
        {
            // TODO: cancel outstanding async calls

            publishStatus(DA);
            parseMessage(DA);
            message = "";

            if (webSocket == null || webSocket.State != WebSocketState.Open)
            {
                connect(DA);
            }
            else
            {
                receiveNextMessage(DA);
            }
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