using System.Net.WebSockets;
using System.Net.Http;

namespace SAN
{
    public class Connection
    {
        public ClientWebSocket webSocket;
        public GraphMessageData graphMessageData;
        public static readonly HttpClient httpClient = new HttpClient();

        // negative, if node ID cannot be found
        public int indexOfNode(string nodeId)
        {
            if (graphMessageData == null) { return -1; }
            return graphMessageData.nodeIds.FindIndex(a => a == nodeId);
        }
    }
}
