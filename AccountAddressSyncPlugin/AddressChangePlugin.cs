using System;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
namespace AccountAddressSyncPlugin
{
    [CrmPluginRegistration(
        MessageNameEnum.Update,
        "account",
        StageEnum.PostOperation,
        ExecutionModeEnum.Synchronous,
        "address1_line1,address1_line2,address1_line3,address1_city,address1_stateorprovince,address1_postalcode,address1_country",
        "AccountAddressSyncPlugin.AddressChangePlugin: Update of account",
        1,
        IsolationModeEnum.Sandbox,
        Description = "Syncs address changes from Account to related Contacts")]
    public class AddressChangePlugin : IPlugin
    {
        private static readonly string[] AddressFields = new[]
        {
            "address1_line1",
            "address1_line2",
            "address1_line3",
            "address1_city",
            "address1_stateorprovince",
            "address1_postalcode",
            "address1_country"
        };

        public void Execute(IServiceProvider serviceProvider)
        {
            var context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            var serviceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            var service = serviceFactory.CreateOrganizationService(context.UserId);
            var tracer = (ITracingService)serviceProvider.GetService(typeof(ITracingService));

            if (context.MessageName != "Update" || context.PrimaryEntityName != "account")
                return;

            var target = (Entity)context.InputParameters["Target"];

            bool addressChanged = false;
            foreach (var field in AddressFields)
            {
                if (target.Contains(field))
                {
                    addressChanged = true;
                    break;
                }
            }

            if (!addressChanged)
                return;

            tracer.Trace("Address change detected on account {0}", context.PrimaryEntityId);

            // Retrieve full current address from account (post-operation values)
            var account = service.Retrieve("account", context.PrimaryEntityId, new ColumnSet(AddressFields));

            var contacts = service.RetrieveMultiple(new QueryExpression("contact")
            {
                ColumnSet = new ColumnSet("contactid"),
                Criteria = new FilterExpression
                {
                    Conditions =
                    {
                        new ConditionExpression("parentcustomerid", ConditionOperator.Equal, context.PrimaryEntityId)
                    }
                }
            });

            tracer.Trace("Updating {0} related contacts", contacts.Entities.Count);

            foreach (var contact in contacts.Entities)
            {
                var update = new Entity("contact", contact.Id);
                foreach (var field in AddressFields)
                    update[field] = account.Contains(field) ? account[field] : null;

                var line3 = account.GetAttributeValue<string>("address1_line3");
                if (string.IsNullOrWhiteSpace(line3))
                    update["description"] = "Address has Changed";

                service.Update(update);
            }
        }
    }
}
