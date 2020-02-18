using System;
using Grasshopper.Kernel;

namespace SAN
{
    public class ConnectionParameter : GH_Param<ConnectionType>
    {
        public ConnectionParameter()
          : base("Connection", "Con", "Connection to SAN", "Params", "Primitive", GH_ParamAccess.item) { }

        public override Guid ComponentGuid
        {
            get { return new Guid("3d90b251-53fd-4511-a0d3-20abfff309bf"); }
        }
    }
}