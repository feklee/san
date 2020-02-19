using System;
using System.Threading;
using System.Text;
using Grasshopper.Kernel;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using Newtonsoft.Json;
using System.Threading.Tasks;
using System.Net.WebSockets;

namespace SAN
{
    public delegate void ExpireSolutionDelegate(Boolean recompute);

    public class GraphMessageData
    {
        public string type;
        public List<string> nodeIds;
        public List<List<int>> nodeIps;
        public List<List<double>> points;
        public List<List<double>> axes;
        public List<List<string>> edges;
        public List<List<List<int>>> colors;
        public string connectionType;
        public List<List<string>> neighbors;
    };

    public class Connect : GH_Component
    {
        private Connection connection;
        private string messageBeingReceived;
        private string lastCompleteMessage = "";
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
        public Connect() : base("Connect to Server", "Connect", "Connect to the SAN server via WebSockets", "SAN", "Graph")
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
        }

        private void parseLastCompleteMessage(IGH_DataAccess DA)
        {
            if (typeOfMessage(lastCompleteMessage) == "graph")
            {
                parseGraphMessage(lastCompleteMessage, DA);
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
                messageBeingReceived = "";
                return;
            }

            string messageFragment = Encoding.UTF8.GetString(buffer.Array, 0, receiveResult.Count);
            messageBeingReceived += messageFragment;
            messageIsComplete = receiveResult.EndOfMessage;
            if (messageIsComplete) {
                lastCompleteMessage = messageBeingReceived;
                messageBeingReceived = "";
                if (typeOfMessage(lastCompleteMessage) == "graph") {
                    receivingMessage = false;
                    expireSolution();
                    return;
                }
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
            parseLastCompleteMessage(DA);
            messageBeingReceived = "";
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

            var c = new ConnectionType(connection);
            DA.SetData(1, c);
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