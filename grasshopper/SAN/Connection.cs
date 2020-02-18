using Grasshopper.Kernel.Types;
using System.Collections.Generic;
using System.Net.WebSockets;

namespace SAN
{
    public class Connection
    {
        public ClientWebSocket webSocket;
        public GraphMessageData graphMessageData;
    }
}
