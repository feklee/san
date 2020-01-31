using System;
using System.Collections.Generic;
using Grasshopper.Kernel;
using Grasshopper.Kernel.Data;
using Grasshopper.Kernel.Types;
using Rhino.Geometry;

namespace SAN
{
    public class Node3D : GH_Component
    {
        Random rand;

        /// <summary>
        /// Initializes a new instance of the MyComponent1 class.
        /// </summary>
        public Node3D()
          : base("Node Mesh", "Node", "3D representation of a network node", "SAN", "Graph")
        {
            rand = new Random();
        }

        /// <summary>
        /// Registers all the input parameters for this component.
        /// </summary>
        protected override void RegisterInputParams(GH_Component.GH_InputParamManager pManager)
        {
            pManager.AddPointParameter("Point", "P", "Point in location of node", GH_ParamAccess.item);
            pManager[0].Optional = true;
            pManager.AddColourParameter("Axis", "A", "Axis of node", GH_ParamAccess.item);
            pManager[1].Optional = true;
            pManager.AddColourParameter("Colors", "C", "Colors of node", GH_ParamAccess.list);
            pManager[2].Optional = true;
        }

        /// <summary>
        /// Registers all the output parameters for this component.
        /// </summary>
        protected override void RegisterOutputParams(GH_Component.GH_OutputParamManager pManager)
        {
            pManager.AddMeshParameter("Mesh", "M", "Mesh representing a node", GH_ParamAccess.item);
        }

        /// <summary>
        /// This is the method that actually does the work.
        /// </summary>
        /// <param name="DA">The DA object is used to retrieve from inputs and store in outputs.</param>
        protected override void SolveInstance(IGH_DataAccess DA)
        {
            var mesh = new Mesh();
            mesh.Vertices.Add(+1, +1, +1);
            mesh.Vertices.Add(-1, -1, +1);
            mesh.Vertices.Add(-1, +1, -1);
            mesh.Vertices.Add(+1, -1, -1);

            mesh.Faces.AddFace(0, 1, 2);
            mesh.Faces.AddFace(0, 1, 3);
            mesh.Faces.AddFace(0, 2, 3);
            mesh.Faces.AddFace(1, 2, 3);
            mesh.Normals.ComputeNormals();
            mesh.Compact();

            var colors = new List<GH_Colour>();
            DA.GetDataList(2, colors);
            foreach (var color in colors)
            {
                mesh.VertexColors.Add(color.Value);
            }

            mesh.Scale(0.1);

            var point = new GH_Point();
            DA.GetData(0, ref point);
            var p = point.Value;
            mesh.Translate(new Vector3d(p));

            var axis = new GH_Vector();
            DA.GetData(1, ref axis);
            var v = axis.Value;

            var rotation = Transform.Rotation(Vector3d.ZAxis, axis.Value, Point3d.Origin);
            mesh.Transform(rotation);

            DA.SetData(0, mesh);
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
            get { return new Guid("8fa5cf36-0696-441c-9041-cbe82ca9d776"); }
        }
    }
}