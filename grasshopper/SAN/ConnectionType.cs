using Grasshopper.Kernel.Types;

namespace SAN
{
    public class ConnectionType : GH_Goo<Connection>
    {
        public ConnectionType(Connection connection)
        {
            this.Value = connection;
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
            get { return "A Connection to SAN"; }
        }

        public override IGH_Goo Duplicate()
        {
            throw new System.NotImplementedException(); // TODO
        }

        public override string ToString()
        {
            if (this.Value.webSocket != null) {
                return this.Value.webSocket.State.ToString();
            }
            return "Not connected";
        }
    }
}