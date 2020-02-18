using System;
using System.Collections.Generic;
using System.Drawing;
using Grasshopper.Kernel;
using Grasshopper.Kernel.Types;

namespace SAN
{
    public class NodeIds : GH_Component
    {
        public NodeIds()
          : base("Node IDs", "NodeIds", "IDs of all nodes in the network", "SAN", "Graph")
        { }

        protected override void RegisterInputParams(GH_Component.GH_InputParamManager pManager)
        {
            pManager.AddParameter(new ConnectionParameter(), "Connection", "Con", "Connection to SAN", GH_ParamAccess.item);
        }

        protected override void RegisterOutputParams(GH_Component.GH_OutputParamManager pManager)
        {
            pManager.AddTextParameter("IDs", "ID", "IDs of all nodes", GH_ParamAccess.list);
        }

        protected override void SolveInstance(IGH_DataAccess DA)
        {
            var con = new ConnectionType();
            DA.GetData(0, ref con);

            var d = con.Value.graphMessageData;
            if (d == null) { return; }

            DA.SetDataList(0, d.nodeIds);
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
            get { return new Guid("667f307e-ab46-41b5-bc29-2dce47dddf7a"); }
        }
    }
}