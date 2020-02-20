using System;
using System.Collections.Generic;
using Grasshopper.Kernel;
using Grasshopper.Kernel.Types;
using Rhino.Geometry;

namespace SAN
{
    public class EdgeLine : GH_Component
    {
        /// <summary>
        /// Initializes a new instance of the MyComponent1 class.
        /// </summary>
        public EdgeLine()
          : base("Edge Line", "EdgeLine", "3D representation of an edge", "SAN", "Graph")
        { }

        /// <summary>
        /// Registers all the input parameters for this component.
        /// </summary>
        protected override void RegisterInputParams(GH_Component.GH_InputParamManager pManager)
        {
            pManager.AddParameter(new ConnectionParameter(), "Connection", "Con", "Connection to SAN", GH_ParamAccess.item);
            pManager[0].WireDisplay = GH_ParamWireDisplay.hidden;
            pManager.AddTextParameter("Edge", "E", "Edge as pair of node IDs", GH_ParamAccess.list);
        }

        /// <summary>
        /// Registers all the output parameters for this component.
        /// </summary>
        protected override void RegisterOutputParams(GH_Component.GH_OutputParamManager pManager)
        {
            pManager.AddLineParameter("Lines", "L", "Line representing the edge", GH_ParamAccess.item);
        }

        protected override void SolveInstance(IGH_DataAccess DA)
        {
            var connectionType = new ConnectionType();
            DA.GetData(0, ref connectionType);
            var connection = connectionType.Value;

            var edge = new List<string>();
            DA.GetDataList(1, edge);

            var pA = connection.nodePoint(edge[0]);
            var pB = connection.nodePoint(edge[1]);
            var l = new Line(pA.Value, pB.Value);
            DA.SetData(0, new GH_Line(l));
        }

        /// <summary>
        /// Provides an Icon for the component.
        /// </summary>
        protected override System.Drawing.Bitmap Icon
        {
            get
            {
                //You can add image files to your project resources and access them like this:
                // return Resources.IconForThisComponent;
                return null;
            }
        }

        /// <summary>
        /// Gets the unique ID for this component. Do not change this ID after release.
        /// </summary>
        public override Guid ComponentGuid
        {
            get { return new Guid("6d3608b5-f814-4885-9603-cba0f2723ef2"); }
        }
    }
}