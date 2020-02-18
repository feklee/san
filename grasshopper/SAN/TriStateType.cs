using Grasshopper.Kernel.Types;

namespace SAN
{
    public class TriStateType : GH_Goo<int>
    {
        public TriStateType()
        {
            this.Value = -1;
        }

        public TriStateType(int tristateValue)
        {
            this.Value = tristateValue;
        }

        public TriStateType(TriStateType tristateSource)
        {
            this.Value = tristateSource.Value;
        }

        public override IGH_Goo Duplicate()
        {
            return new TriStateType(this);
        }

        public override int Value
        {
            get { return base.Value; }
            set
            {
                if (value < -1) { value = -1; }
                if (value > +1) { value = +1; }
                base.Value = value;
            }
        }

        public override bool IsValid
        {
            get { return true; }
        }

        public override string TypeName
        {
            get { return "TriState"; }
        }

        public override string TypeDescription
        {
            get { return "A TriState Value (True, False or Unknown)"; }
        }

        public override string ToString()
        {
            if (this.Value == 0) { return "False"; }
            if (this.Value > 0) { return "True"; }
            return "Unknown";
        }
    }
}