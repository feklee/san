using Grasshopper.Kernel.Types;

namespace SAN
{
    public class ConnectionType : GH_Goo<int>
    {
        public ConnectionType()
        {
            this.Value = -1;
        }

        public ConnectionType(int ConnectionValue)
        {
            this.Value = ConnectionValue;
        }

        public ConnectionType(ConnectionType ConnectionSource)
        {
            this.Value = ConnectionSource.Value;
        }

        public override IGH_Goo Duplicate()
        {
            return new ConnectionType(this);
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
            get { return "Connection"; }
        }

        public override string TypeDescription
        {
            get { return "A Connection Value (True, False or Unknown)"; }
        }

        public override string ToString()
        {
            if (this.Value == 0) { return "False"; }
            if (this.Value > 0) { return "True"; }
            return "Unknown";
        }
    }
}