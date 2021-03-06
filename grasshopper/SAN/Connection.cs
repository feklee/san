﻿using System.Net.WebSockets;
using System.Net.Http;
using Grasshopper.Kernel.Types;
using Rhino.Geometry;
using System.Text;
using System;
using System.Threading;

namespace SAN
{
    public class Connection
    {
        public ClientWebSocket webSocket;
        public Graph graph;
        public static readonly HttpClient httpClient = new HttpClient();

        // negative, if node ID cannot be found
        public int indexOfNode(string nodeId)
        {
            if (graph == null) { return -1; }
            return graph.nodeIds.FindIndex(a => a == nodeId);
        }

        public GH_Point nodePoint(string nodeId)
        {
            var i = indexOfNode(nodeId);
            if (i < 0) {
                return null;
            }

            var p = graph.points[i];
            var p3d = new Point3d(p[0], p[1], p[2]);
            return new GH_Point(p3d);
        }

        public void send(string json)
        {
            var encoded = Encoding.UTF8.GetBytes(json);
            var buffer = new ArraySegment<byte>(encoded, 0, encoded.Length);
            if (webSocket.State == WebSocketState.Open)
            {
                webSocket.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);
            }
        }
    }
}
