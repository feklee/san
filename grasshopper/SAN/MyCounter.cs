using System;
using System.Collections.Generic;
using System.Windows.Forms;
using Grasshopper.Kernel;

namespace SAN
{
    public class MyCounter : GH_Component
    {
        /// <summary>
        /// Initializes a new instance of the MyComponent1 class.
        /// </summary>
        public MyCounter() : base("Counter", "CNT", "Counter that increases with time.", "Extra", "Simple")
        { }

        /// <summary>
        /// Registers all the input parameters for this component.
        /// </summary>
        protected override void RegisterInputParams(GH_Component.GH_InputParamManager pManager)
        {
        }

        /// <summary>
        /// Registers all the output parameters for this component.
        /// </summary>
        protected override void RegisterOutputParams(GH_Component.GH_OutputParamManager pManager)
        {
            pManager.AddNumberParameter("Counter", "counter", "Increases with time", GH_ParamAccess.item);
        }

        private Timer timer1;
        private int x = 0;

        private void solveIt(object sender, EventArgs e, IGH_DataAccess DA)
        {
            DA.SetData(0, x);
            x++;
//            ExpireSolution(false);
        }

        /// <summary>
        /// This is the method that actually does the work.
        /// </summary>
        /// <param name="DA">The DA object is used to retrieve from inputs and store in outputs.</param>
        protected override void SolveInstance(IGH_DataAccess DA)
        {
            timer1 = new Timer();
            timer1.Tick += new EventHandler((sender, e) => solveIt(sender, e, DA));
            timer1.Interval = 2000; // in miliseconds
            timer1.Start();
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
            get { return new Guid("8b70a0c1-2b81-46cb-9c12-831a0a94b61b"); }
        }
    }
}