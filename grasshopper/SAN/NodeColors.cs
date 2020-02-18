using System;
using System.Collections.Generic;
using System.Drawing;
using Grasshopper.Kernel;
using Grasshopper.Kernel.Types;

namespace SAN
{
    public class NodeColors : GH_Component
    {
        public NodeColors()
          : base("Node Colors", "NodeColors", "Colors of the LEDs of the node", "SAN", "Graph")
        {
        }

        protected override void RegisterInputParams(GH_Component.GH_InputParamManager pManager)
        {
            pManager.AddParameter(new ConnectionParameter(), "Connection", "Con", "Connection to SAN", GH_ParamAccess.item);
            pManager.AddTextParameter("Node ID", "ID", "ID of the node", GH_ParamAccess.item);
        }

        protected override void RegisterOutputParams(GH_Component.GH_OutputParamManager pManager)
        {
            pManager.AddColourParameter("Colors", "C", "Four colors of node", GH_ParamAccess.list);
        }

        protected override void SolveInstance(IGH_DataAccess DA)
        {
            var con = new ConnectionType();
            DA.GetData(0, ref con);

            string id = "";
            DA.GetData(1, ref id);

            var d = con.Value.graphMessageData;
            if (d == null) { return; }

            var i = con.Value.indexOfNode(id);
            if (i < 0) { return; }

            var colorsOfNodeToConvert = d.colors[i];
            var colorsOfNode = new List<GH_Colour>();
            foreach (var colorToConvert in colorsOfNodeToConvert)
            {
                var color = Color.FromArgb(colorToConvert[0], colorToConvert[1], colorToConvert[2]);
                colorsOfNode.Add(new GH_Colour(color));
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