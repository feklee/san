using System;
using Grasshopper.Kernel;

namespace SAN
{
    public class SimpleMathematicsComponent : GH_Component
    {
        /// <summary>
        /// Initializes a new instance of the MyComponent1 class.
        /// </summary>
        public SimpleMathematicsComponent() : base("SimpleMathematics", "SM", "Simple mathematics component", "Extra", "Simple")
        {
        }

        /// <summary>
        /// Registers all the input parameters for this component.
        /// </summary>
        protected override void RegisterInputParams(GH_Component.GH_InputParamManager pManager)
        {
            pManager.AddNumberParameter("Angle", "A", "The angle to measure", GH_ParamAccess.item);
            pManager.AddBooleanParameter("Radians", "R", "Work in Radians", GH_ParamAccess.item, true); // the default value us 'true'
        }

        /// <summary>
        /// Registers all the output parameters for this component.
        /// </summary>
        protected override void RegisterOutputParams(GH_Component.GH_OutputParamManager pManager)
        {
            pManager.AddNumberParameter("Sin", "sin", "The sine of the Angle.", GH_ParamAccess.item);
            pManager.AddNumberParameter("Cos", "cos", "The cosine of the Angle.", GH_ParamAccess.item);
            pManager.AddNumberParameter("Tan", "tan", "The tangent of the Angle.", GH_ParamAccess.item);
        }

        /// <summary>
        /// This is the method that actually does the work.
        /// </summary>
        /// <param name="DA">The DA object is used to retrieve from inputs and store in outputs.</param>
        protected override void SolveInstance(IGH_DataAccess DA)
        {
            double angle = double.NaN;
            bool radians = false;

            if (!DA.GetData(0, ref angle)) { return; }
            if (!DA.GetData(1, ref radians)) { return; }

            if (!Rhino.RhinoMath.IsValidDouble(angle)) { return; }

            if (!radians)
            {
                angle = Rhino.RhinoMath.ToRadians(angle);
            }

            DA.SetData(0, Math.Sin(angle));
            DA.SetData(1, Math.Cos(angle));
            DA.SetData(2, Math.Tan(angle));
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
            get { return new Guid("3375cdb5-9cf9-47af-b2b9-060c5b819e5a"); }
        }
    }
}