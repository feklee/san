using Grasshopper.Kernel.Types;

namespace SAN
{
    public class ConnectionType : GH_Goo<Connection>
    {
        public ConnectionType()
        {
            this.Value = null;
        }

        public ConnectionType(Connection connection)
        {
            this.Value = connection;
        }

        public ConnectionType(ConnectionType connectionSource)
        {
            this.Value = connectionSource.Value;
        }

        public override IGH_Goo Duplicate()
        {
            return new ConnectionType(this);
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

        public override string ToString()
        {
            if (this.Value.webSocket != null) {
                return this.Value.webSocket.State.ToString();
            }
            return "Not connected";
        }
    }
}