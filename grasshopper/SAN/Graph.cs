using System;
using System.Net.WebSockets;
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

namespace SAN
{
    public class GraphMessageData
    {
        public string type;
        public List<string> nodeIds;
        public List<List<double>> points;
        public List<List<List<double>>> lines;
        public List<List<List<int>>> colors;
    };

    public class Graph : GH_Component
    {
        private ClientWebSocket webSocket;
        private List<string> receivedMessages;

        /// <summary>
        /// Initializes a new instance of the MyComponent1 class.
        /// </summary>
        public Graph()
          : base("SanWebSocket", "SWS", "Web socket client for SAN", "SAN", "Communication")
        {
            receivedMessages = new List<string>();
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
            pManager.AddTextParameter("Messages", "messages", "Received messages", GH_ParamAccess.list);
            pManager.AddTextParameter("GraphDataMessage", "GraphDataMessage", "Latest GraphData message", GH_ParamAccess.item);
            pManager.AddTextParameter("NodeIds", "nodeIds", "Node IDs", GH_ParamAccess.list);
            pManager.AddPointParameter("NodePoints", "nodePoints", "Points at node locations", GH_ParamAccess.list);
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
            foreach (List<double> point in graphMessageData.points)
            {
                Point3d p = new Point3d(point[0], point[1], point[2]);
                nodePoints.Add(new GH_Point(p));
            }

            var edgeLines = new List<GH_Line>();
            foreach (List<List<double>> edgeLine in graphMessageData.lines)
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

            ClearData();
            DA.SetData(7, message);
            DA.SetDataList(8, graphMessageData.nodeIds);
            DA.SetDataList(9, nodePoints);
            DA.SetDataList(10, edgeLines);
            DA.SetDataTree(11, colors);
        }

        private void parseMessage(string message, IGH_DataAccess DA)
        {
            DA.SetData(3, message);
            DA.SetData(4, typeOfMessage(message));

            receivedMessages.Add(message);
            DA.SetDataList(6, receivedMessages);
            if (typeOfMessage(message) == "graph") {
                parseGraphMessage(message, DA);
            }
        }

        private void parseWebSocketBuffer(WebSocketReceiveResult receiveResult, ArraySegment<byte> buffer, IGH_DataAccess DA)
        {
            DA.SetData(1, receiveResult.MessageType);
            if (receiveResult.MessageType != WebSocketMessageType.Text) { return; }
            DA.SetData(2, buffer.ToString());
            string message = Encoding.UTF8.GetString(buffer.Array, 0, receiveResult.Count);
            parseMessage(message, DA);
        }

        private void receive(IGH_DataAccess DA)
        {
            byte[] byteArray = new byte[65536];
            var buffer = new ArraySegment<byte>(byteArray, 0, byteArray.Length);

            webSocket.ReceiveAsync(buffer, CancellationToken.None).ContinueWith(res =>
            {
                parseWebSocketBuffer(res.Result, buffer, DA);
                receive(DA);
            });
        }

        /// <summary>
        /// This is the method that actually does the work.
        /// </summary>
        /// <param name="DA">The DA object is used to retrieve from inputs and store in outputs.</param>
        protected override async void SolveInstance(IGH_DataAccess DA)
        {
            if (webSocket != null && webSocket.State == WebSocketState.Open)
            {
                return;
            }

            Uri uri = new Uri("ws://felix-arch:8080");
            try
            {
                webSocket = new ClientWebSocket();
                await webSocket.ConnectAsync(uri, CancellationToken.None);
            }
            catch (Exception ex)
            {
                DA.SetData(0, ex.ToString());
            }
            if (webSocket == null) { return; }
            DA.SetData(0, webSocket.State.ToString());
            if (webSocket.State != WebSocketState.Open) { return; }

            receive(DA);
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