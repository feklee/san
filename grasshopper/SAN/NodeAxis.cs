using System;
using System.Collections.Generic;
using Grasshopper.Kernel;
using Grasshopper.Kernel.Types;
using Rhino.Geometry;

namespace SAN
{
    public class NodeAxis : GH_Component
    {
        public NodeAxis()
          : base("Node Axis", "NodeAxis", "Axis defining the orientation of the node", "SAN", "Graph")
        { }

        protected override void RegisterInputParams(GH_Component.GH_InputParamManager pManager)
        {
            pManager.AddParameter(new ConnectionParameter(), "Connection", "Con", "Connection to SAN", GH_ParamAccess.item);
            pManager[0].WireDisplay = GH_ParamWireDisplay.hidden;
            pManager.AddTextParameter("Node ID", "ID", "ID of the node", GH_ParamAccess.item);
        }

        protected override void RegisterOutputParams(GH_Component.GH_OutputParamManager pManager)
        {
            pManager.AddVectorParameter("Axis", "A", "Axis", GH_ParamAccess.item);
        }

        protected override void SolveInstance(IGH_DataAccess DA)
        {
            var con = new ConnectionType();
            DA.GetData(0, ref con);

            string id = "";
            DA.GetData(1, ref id);

            var d = con.Value.graph;
            if (d == null) { return; }

            var i = con.Value.indexOfNode(id);
            if (i < 0) { return; }

            var axis = d.axes[i];
            var v = new Vector3d(axis[0], axis[1], axis[2]);
            DA.SetData(0, new GH_Vector(v));
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
            get { return new Guid("a49a0c5f-8abb-482a-b59b-d8fe991a614f"); }
        }
    }
}