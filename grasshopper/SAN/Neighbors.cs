using System;
using System.Collections.Generic;
using Grasshopper.Kernel;

namespace SAN
{
    public class Neighbors : GH_Component
    {
        public Neighbors() : base("Neighbors", "Neighbors", "Neighbors of the node", "SAN", "Graph")
        { }

        protected override void RegisterInputParams(GH_Component.GH_InputParamManager pManager)
        {
            pManager.AddParameter(new ConnectionParameter(), "Connection", "Con", "Connection to SAN", GH_ParamAccess.item);
            pManager[0].WireDisplay = GH_ParamWireDisplay.hidden;
            pManager.AddTextParameter("Node ID", "ID", "ID of the node", GH_ParamAccess.item);
        }

        protected override void RegisterOutputParams(GH_Component.GH_OutputParamManager pManager)
        {
            pManager.AddTextParameter("Neighbors", "N", "IDs of connected nodes", GH_ParamAccess.list);
        }

        protected override void SolveInstance(IGH_DataAccess DA)
        {
            var connectionType = new ConnectionType();
            DA.GetData(0, ref connectionType);
            var connection = connectionType.Value;

            string id = "";
            DA.GetData(1, ref id);
            var nodeIndex = connection.indexOfNode(id);
            if (nodeIndex < 0) { return; }

            var d = connection.graph;
            if (d == null) { return; }

            // TODO: d.neighbors[nodeIndex]
            DA.SetDataList(0, new List<string>());
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
            get { return new Guid("e734d28d-b0ab-4fcc-a460-cc70164a128f"); }
        }
    }
}