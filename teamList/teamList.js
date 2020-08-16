import { LightningElement, wire, track } from "lwc";

//import method which should be used from Controller
import getTeamName from "@salesforce/apex/TeamController.getTeamName";
import getTeamList from "@salesforce/apex/TeamController.getTeamList";

let i = 0;
export default class TeamList extends LightningElement {
  items = [];
  @track
  teamMember = [];

  @track
  value = "";

  handleChange(event) {
    this.teamMember = [];
    // Get the string of the "value" attribute on the selected option
    this.value = event.detail.value;
    this.handleLoad();
  }

  @wire(getTeamName)
  wiredUserRoles({ data, error }) {
    if (data) {
      // eslint-disable-next-line no-console
      //console.log(data);

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
      //this.contacts = undefined;
    }
  }

  // @wire(getTeamList, { teamName: "$value" })
  // wiredTeamListCallback({ data, error }) {
  //   if (data) {
  //     // eslint-disable-next-line no-console
  //     console.log(data);

  //     data.forEach(member => {
  //       this.teamMember.push({
  //         id: member.Id,
  //         Name: member.Name,
  //         Skills: member.Skills__c
  //       });
  //     });
  //   } else if (error) {
  //     this.error = error;
  //   }
  // }

  handleLoad() {
    getTeamList({ teamName: this.value })
      .then(result => {
        // eslint-disable-next-line no-console
        console.log(result);
        result.forEach(r => {
          this.teamMember.push({
            id: r.Id,
            Name: r.Name,
            Skills: r.Skills__c
          });
        });
        // eslint-disable-next-line no-console
        console.log(this.teamMember);
      })
      .catch(error => {
        this.error = error;
      });
  }

  //gettter to return items which is mapped with options attribute
  get roleOptions() {
    return this.items;
  }
}
