using System;
using System.Collections.Generic;
using Grasshopper.Kernel;
using Grasshopper.Kernel.Types;
using Rhino.Geometry;

namespace SAN
{
    public class NodePoint : GH_Component
    {
        public NodePoint()
          : base("Node Point", "NodePoint", "Point at the location of the node", "SAN", "Graph")
        { }

        protected override void RegisterInputParams(GH_Component.GH_InputParamManager pManager)
        {
            pManager.AddParameter(new ConnectionParameter(), "Connection", "Con", "Connection to SAN", GH_ParamAccess.item);
            pManager.AddTextParameter("Node ID", "ID", "ID of the node", GH_ParamAccess.item);
        }

        protected override void RegisterOutputParams(GH_Component.GH_OutputParamManager pManager)
        {
            pManager.AddPointParameter("Point", "P", "Point at node location", GH_ParamAccess.item);
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

            var p = d.points[i];
            var p3d = new Point3d(p[0], p[1], p[2]);
            DA.SetData(0, new GH_Point(p3d));
        }

        protected override System.Drawing.Bitmap Icon
        {
            get
            {
                //You can add image files to your project resources and access them like this:
                // return Resources.IconForThisComponent;
                return null;
            }
        }

        public override Guid ComponentGuid
        {
            get { return new Guid("87f5f9f2-ce0e-43a3-abf2-777fc8189460"); }
        }
    }
}