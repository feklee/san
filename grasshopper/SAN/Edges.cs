using System;
using System.Collections.Generic;
using Grasshopper;
using Grasshopper.Kernel;

namespace SAN
{
    public class Edges : GH_Component
    {
        public Edges()
          : base("Edges", "Edges", "Pairs of IDs for all edges in the network", "SAN", "Graph")
        { }

        protected override void RegisterInputParams(GH_Component.GH_InputParamManager pManager)
        {
            pManager.AddParameter(new ConnectionParameter(), "Connection", "Con", "Connection to SAN", GH_ParamAccess.item);
        }

        protected override void RegisterOutputParams(GH_Component.GH_OutputParamManager pManager)
        {
            pManager.AddTextParameter("Edges", "E", "Edges", GH_ParamAccess.tree);
        }

        protected override void SolveInstance(IGH_DataAccess DA)
        {
            var connectionType = new ConnectionType();
            DA.GetData(0, ref connectionType);
            var connection = connectionType.Value;

            var d = connection.graph;
            if (d == null) { return; }

            var edgeTree = new DataTree<string>();
            var pathIndex = 0;
            foreach (var edge in d.edges)
            {
                var nodeIdsOfEdge = new List<string>();
                foreach (var nodeId in edge)
                {
                    nodeIdsOfEdge.Add(nodeId);
                }
                edgeTree.AddRange(nodeIdsOfEdge, new Grasshopper.Kernel.Data.GH_Path(pathIndex));
                pathIndex++;
            }
            DA.SetDataTree(0, edgeTree);
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
            get { return new Guid("0652d8fd-3fc7-443b-8c91-ecb7fc903fd6"); }
        }
    }
}