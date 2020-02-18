using System;
using System.Collections.Generic;
using System.Drawing;
using System.Net.Http;
using Grasshopper.Kernel;
using Grasshopper.Kernel.Types;

namespace SAN
{
    public class NodeColors : GH_Component
    {
        public NodeColors()
          : base("Node Colors", "NodeColors", "Colors of the LEDs of the node", "SAN", "Graph")
        { }

        protected override void RegisterInputParams(GH_Component.GH_InputParamManager pManager)
        {
            pManager.AddParameter(new ConnectionParameter(), "Connection", "Con", "Connection to SAN", GH_ParamAccess.item);
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

        private List<GH_Colour> loadColorsFromGraph(GraphMessageData d, int nodeIndex)
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

        private char colorComponentChar(byte value)
        {
            return (char)((value >> 6) + 48); // between 0 and 3
        }

        private string colorString(GH_Colour color)
        {
            var c = color.Value;
            char[] a = {colorComponentChar(c.R), colorComponentChar(c.G), colorComponentChar(c.B)};
            return new string(a);
        }

        private async void sendColorsToNode(int nodeIndex, List<GH_Colour> colors)
        {
            string command = "C";
            foreach (GH_Colour color in colors)
            {
                command += colorString(color);
            }
            Console.Write(command);
            try
            {
                await Connection.httpClient.GetAsync("http://192.168.4.104?" + command);
            }
            catch (HttpRequestException) { }
        }

        protected override void SolveInstance(IGH_DataAccess DA)
        {
            var connectionType = new ConnectionType();
            DA.GetData(0, ref connectionType);
            var connection = connectionType.Value;
            var colorHasChanged = false;

            var d = connection.graphMessageData;
            if (d == null) { return; }

            string id = "";
            DA.GetData(1, ref id);
            var nodeIndex = connection.indexOfNode(id);
            if (nodeIndex < 0) { return; }
            var colorsOfNode = loadColorsFromGraph(d, nodeIndex);
            if (colorsOfNode == null) { return; }

            for (int i = 0; i < 4; i++)
            {
                var color = new GH_Colour();
                if (DA.GetData(2 + i, ref color))
                {
                    if (color != colorsOfNode[i])
                    {
                        colorsOfNode[i] = color;
                        colorHasChanged = true;
                    }
                }
            }

            if (colorHasChanged)
            {
                sendColorsToNode(nodeIndex, colorsOfNode);
            }

            DA.SetDataList(0, colorsOfNode);
        }

        protected override System.Drawing.Bitmap Icon
        {
            get
            {
                return null;
            }
        }

        public override Guid ComponentGuid
        {
            get { return new Guid("2df65473-c508-4dd8-a24e-7f6ab14b521f"); }
        }
    }
}