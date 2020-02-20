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
            pManager[0].WireDisplay = GH_ParamWireDisplay.hidden;
            pManager.AddTextParameter("Node ID", "ID", "ID of the node", GH_ParamAccess.item);
        }

        protected override void RegisterOutputParams(GH_Component.GH_OutputParamManager pManager)
        {
            pManager.AddPointParameter("Point", "P", "Point at node location", GH_ParamAccess.item);
        }

        protected override void SolveInstance(IGH_DataAccess DA)
        {
            var connectionType = new ConnectionType();
            DA.GetData(0, ref connectionType);
            var connection = connectionType.Value;

            string id = "";
            DA.GetData(1, ref id);
            DA.SetData(0, connection.nodePoint(id));
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