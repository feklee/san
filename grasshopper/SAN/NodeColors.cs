using System;
using System.Collections.Generic;
using System.Drawing;
using Grasshopper.Kernel;
using Grasshopper.Kernel.Types;
using Newtonsoft.Json;

namespace SAN
{
    public class NodeColors : GH_Component
    {
        class NodeColorMessage
        {
            public string type;
            public string nodeId;
            public List<List<byte>> colors;
        };

        public NodeColors()
          : base("Node Colors", "NodeColors", "Colors of the LEDs of the node", "SAN", "Visualization")
        { }

        protected override void RegisterInputParams(GH_Component.GH_InputParamManager pManager)
        {
            pManager.AddParameter(new ConnectionParameter(), "Connection", "Con", "Connection to SAN", GH_ParamAccess.item);
            pManager[0].WireDisplay = GH_ParamWireDisplay.hidden;
            pManager.AddTextParameter("Node ID", "ID", "ID of the node", GH_ParamAccess.item);
            pManager.AddColourParameter("Color 1", "C1", "Color of LED 1", GH_ParamAccess.item);
            pManager[2].Optional = true;
            pManager.AddColourParameter("Color 2", "C2", "Color of LED 2", GH_ParamAccess.item);
            pManager[3].Optional = true;
            pManager.AddColourParameter("Color 3", "C3", "Color of LED 3", GH_ParamAccess.item);
            pManager[4].Optional = true;
            pManager.AddColourParameter("Color 4", "C4", "Color of LED 4", GH_ParamAccess.item);
            pManager[5].Optional = true;
        }

        protected override void RegisterOutputParams(GH_Component.GH_OutputParamManager pManager)
        {
            pManager.AddColourParameter("Colors", "C", "Four colors of node", GH_ParamAccess.list);
        }

        private List<GH_Colour> colorsFromGraph(Graph d, int nodeIndex)
        {
            var colorsOfNodeToConvert = d.colors[nodeIndex];
            var colorsOfNode = new List<GH_Colour>();
            foreach (var colorToConvert in colorsOfNodeToConvert)
            {
                var color = Color.FromArgb(colorToConvert[0], colorToConvert[1], colorToConvert[2]);
                colorsOfNode.Add(new GH_Colour(color));
            }
            return colorsOfNode;
        }

        private void sendColorsToServer(Connection connection, string nodeId, List<GH_Colour> colors)
        {
            var message = new NodeColorMessage();

            message.nodeId = nodeId;
            message.type = "node colors";
            message.colors = new List<List<byte>>();
            foreach (GH_Colour color in colors)
            {
                var c = color.Value;
                var colorToSend = new List<byte>(new byte[] {c.R, c.G, c.B});
                message.colors.Add(colorToSend);
            }

            var json = JsonConvert.SerializeObject(message);
            connection.send(json);
        }

        protected override void SolveInstance(IGH_DataAccess DA)
        {
            var connectionType = new ConnectionType();
            DA.GetData(0, ref connectionType);
            var connection = connectionType.Value;
            var colorHasChanged = false;

            var d = connection.graph;
            if (d == null) { return; }

            string id = "";
            DA.GetData(1, ref id);
            var nodeIndex = connection.indexOfNode(id);
            if (nodeIndex < 0) { return; }
            var colorsOfNode = colorsFromGraph(d, nodeIndex);
            if (colorsOfNode == null) { return; }

            for (int i = 0; i < 4; i++)
            {
                var color = new GH_Colour();
                if (DA.GetData(2 + i, ref color))
                {
                    if (colorsOfNode[i].Value != color.Value)
                    {
                        colorsOfNode[i] = color;
                        colorHasChanged = true;
                    }
                }
            }

            if (colorHasChanged)
            {
                sendColorsToServer(connection, id, colorsOfNode);
            }

            DA.SetDataList(0, colorsOfNode);
        }

        protected override System.Drawing.Bitmap Icon
        {
            get
            {
                return Properties.Resources.NodeColors;
            }
        }

        public override Guid ComponentGuid
        {
            get { return new Guid("2df65473-c508-4dd8-a24e-7f6ab14b521f"); }
        }
    }
}