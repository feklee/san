using System;
using Grasshopper.Kernel;

namespace SAN
{
    public class MyFirstComponent : GH_Component
    {
        public MyFirstComponent() : base("MyFirst", "MFC", "My first component", "Extra", "Simple")
        { }

        public override Guid ComponentGuid
        {
            get { return new Guid("d04c9147-ee07-4952-85bb-743b3d903e76"); }
        }

        protected override void RegisterInputParams(GH_InputParamManager pManager)
        {
            pManager.AddTextParameter("String", "S", "String to reverse", GH_ParamAccess.item);
        }

        protected override void RegisterOutputParams(GH_OutputParamManager pManager)
        {
            pManager.AddTextParameter("Reverse", "R", "Reveresed string", GH_ParamAccess.item);
        }

        protected override void SolveInstance(IGH_DataAccess DA)
        {
            string data = null;

            if (!DA.GetData(0, ref data)) { return; }

            if (data == null) { return; }
            if (data.Length == 0) { return; }

            char[] chars = data.ToCharArray();
            System.Array.Reverse(chars);

            DA.SetData(0, new string(chars));
        }
    }
}
