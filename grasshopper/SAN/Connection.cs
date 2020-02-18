using Grasshopper.Kernel.Types;
using System.Collections.Generic;
using System.Net.WebSockets;

namespace SAN
{
    public class Connection
    {
        public ClientWebSocket webSocket;
        public GraphMessageData graphMessageData;

        // negative, if node ID cannot be found
        public int indexOfNode(string nodeId)
        {
            if (graphMessageData == null) { return -1; }
            return graphMessageData.nodeIds.FindIndex(a => a == nodeId);
        }
    }
}
