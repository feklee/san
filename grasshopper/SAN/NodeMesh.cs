using System;
using System.Collections.Generic;
using Grasshopper.Kernel;
using Grasshopper.Kernel.Types;
using Rhino.Geometry;

namespace SAN
{
    public class NodeMesh : GH_Component
    {
        Random rand;

        /// <summary>
        /// Initializes a new instance of the MyComponent1 class.
        /// </summary>
        public NodeMesh()
          : base("Node Mesh", "NodeMesh", "3D representation of a network node", "SAN", "Graph")
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

            pManager.AddParameter(new TriStateParameter(), "Test", "T", "My test", GH_ParamAccess.item);
            pManager[3].Optional = true;
        }

        /// <summary>
        /// Registers all the output parameters for this component.
        /// </summary>
        protected override void RegisterOutputParams(GH_Component.GH_OutputParamManager pManager)
        {
            pManager.AddMeshParameter("Mesh", "M", "Mesh representing a node", GH_ParamAccess.item);
            pManager.AddParameter(new TriStateParameter(), "Test2", "T2", "My test #2", GH_ParamAccess.item);
        }

        private void orientMeshAlongAxis(Mesh mesh, GH_Vector axis)
        {
            var rotation = Transform.Rotation(Vector3d.ZAxis, axis.Value, Point3d.Origin);
            mesh.Transform(rotation);
        }

        private void moveMeshToPoint(Mesh mesh, GH_Point point)
        {
            mesh.Translate(new Vector3d(point.Value));
        }

        private void setVertexColorsOfMesh(Mesh mesh, List<GH_Colour> colors)
        {
            foreach (var color in colors)
            {
                mesh.VertexColors.Add(color.Value);
            }
        }

        private Mesh createTetrahedronMesh()
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
            mesh.Scale(0.1);
            return mesh;
        }

        /// <summary>
        /// This is the method that actually does the work.
        /// </summary>
        /// <param name="DA">The DA object is used to retrieve from inputs and store in outputs.</param>
        protected override void SolveInstance(IGH_DataAccess DA)
        {
            Mesh mesh = createTetrahedronMesh();

            var colors = new List<GH_Colour>();
            DA.GetDataList(2, colors);
            setVertexColorsOfMesh(mesh, colors);

            var axis = new GH_Vector();
            DA.GetData(1, ref axis);
            orientMeshAlongAxis(mesh, axis);

            var point = new GH_Point();
            DA.GetData(0, ref point);
            moveMeshToPoint(mesh, point);

            DA.SetData(0, mesh);

            var t = new TriStateType();
            DA.GetData(3, ref t);
            DA.SetData(1, t);
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