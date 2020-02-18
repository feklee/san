using System;
using System.Collections.Generic;
using Grasshopper.Kernel;

namespace SAN
{
    public class TriStateParameter : GH_PersistentParam<TriStateType>
    {
        public TriStateParameter()
          : base("TriState", "Tri", "Represents a collection of TriState values", "Params", "Primitive")
        {
        }

        public override Guid ComponentGuid
        {
            get { return new Guid("2b9305d8-28c7-4776-af22-06fca738b7cf"); }
        }

        protected override GH_GetterResult Prompt_Singular(ref TriStateType value)
        {
            var go = new Rhino.Input.Custom.GetOption();
            go.SetCommandPrompt("TriState value");
            go.AcceptNothing(true);
            go.AddOption("True");
            go.AddOption("False");
            go.AddOption("Unknown");

            switch (go.Get())
            {
                case Rhino.Input.GetResult.Option:
                    if (go.Option().EnglishName == "True") { value = new TriStateType(1); }
                    if (go.Option().EnglishName == "False") { value = new TriStateType(0); }
                    if (go.Option().EnglishName == "Unknown") { value = new TriStateType(-1); }
                    return GH_GetterResult.success;

                case Rhino.Input.GetResult.Nothing:
                    return GH_GetterResult.accept;

                default:
                    return GH_GetterResult.cancel;
            }
        }

        protected override GH_GetterResult Prompt_Plural(ref List<TriStateType> values)
        {
            values = new List<TriStateType>();

            while (true)
            {
                TriStateType val = null;
                switch (Prompt_Singular(ref val))
                {
                    case GH_GetterResult.success:
                        values.Add(val);
                        break;

                    case GH_GetterResult.accept:
                        return GH_GetterResult.success;

                    case GH_GetterResult.cancel:
                        values = null;
                        return GH_GetterResult.cancel;
                }
            }
        }
    }
}