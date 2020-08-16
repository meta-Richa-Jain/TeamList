import { LightningElement, wire } from "lwc";
import { createRecord } from "lightning/uiRecordApi";
import { ShowToastEvent } from "lightning/platformShowToastEvent";
import TEAM_MEMBER from "@salesforce/schema/TeamMember__c";
import NAME_FIELD from "@salesforce/schema/TeamMember__c.Name";
import SKILLS_FIELD from "@salesforce/schema/TeamMember__c.Skills__c";
import TEAM_FIELD from "@salesforce/schema/TeamMember__c.Team__c";

//import method which should be used from Controller
import getTeamName from "@salesforce/apex/TeamController.getTeamName";
let i = 0;
export default class MemberSkills extends LightningElement {
  name = "";
  skills = "";
  items = [];

  value = "new";

  @wire(getTeamName)
  wiredUserRoles({ data, error }) {
    if (data) {
      // eslint-disable-next-line no-console
      // console.log(data);

      //     //create array with elements which has been retrieved controller
      //     //here value will be Id and label of combobox will be Name
      for (i = 0; i < data.length; i++) {
        this.items = [
          ...this.items,
          { value: data[i].Id, label: data[i].Name }
        ];
      }
      this.error = undefined;
    } else if (error) {
      this.error = error;
      // this.contacts = undefined;
    }
  }

  handleChange(event) {
    // Get the string of the "value" attribute on the selected option
    // eslint-disable-next-line no-console
    console.log(event.detail);
    const field = event.target.name;
    if (field === "Name") {
      this.name = event.target.value;
    } else if (field === "Skills") {
      this.skills = event.target.value;
    } else {
      this.value = event.detail.value;
    }
  }

  //gettter to return items which is mapped with options attribute
  get roleOptions() {
    return this.items;
  }

  createAccount() {
    const fields = {};
    fields[NAME_FIELD.fieldApiName] = this.name;
    fields[SKILLS_FIELD.fieldApiName] = this.skills;
    fields[TEAM_FIELD.fieldApiName] = this.value;
    const recordInput = { apiName: TEAM_MEMBER.objectApiName, fields };
    createRecord(recordInput)
      .then(teamMember => {
        // eslint-disable-next-line no-console
        console.log(recordInput);
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Success",
            message: "Member created",
            variant: "success"
          })
        );
      })
      .catch(error => {
        this.dispatchEvent(
          new ShowToastEvent({
            title: "Error creating record",
            message: error.body.message,
            variant: "error"
          })
        );
      });
  }
}
