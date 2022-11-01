<script>
export default {
  name: "app",
  data() {
    return {
      issues: [],
      newIssueSummary: "",
      newIssueDesc: ""
    }
  },
  methods: {
    createIssue() {
      fetch('http://localhost:3000/issue',
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: 'Basic ' + btoa('rasm5970@edu.ucl.dk' + ":" + 'VYytnDqXjmFKo1jb43lK720E')
          },
          body: JSON.stringify({
            "fields": {
              "project": {
                "key": "EARK"
              },
              "summary": this.newIssueSummary,
              "description": this.newIssueDesc,
              "issuetype": {
                "id": "10001"
              }
            }
          }),
        })
        .then((res) => res.json())
        .then((res) => {
          const { data } = res
          this.issues = [{ id: data.id, key: data.key, fields: { summary: this.newIssueSummary, description: this.newIssueDesc } }, ...this.issues]
          this.newIssueDesc = this.newIssueSummary = ""
        });
    },

    getIssues() {
      fetch('http://localhost:3000/rest/api/2/search?jql=project=EARK&maxResults=1000',
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: 'Basic ' + btoa('rasm5970@edu.ucl.dk' + ":" + 'VYytnDqXjmFKo1jb43lK720E')
          },

        })
        .then((response) => response.json())
        .then((data) => {
          const { issues } = data
          this.issues = issues
        });
    }
  },
  mounted() {
    this.getIssues()
  }
}
</script>

<template>
  <div>
    <h1>Issues</h1>
    <ul>
      <li v-for="issue in issues" :key="issue.key">
        <strong>{{ issue.key }} : {{ issue.fields.summary }}</strong>
        <br />
        <small>{{ issue.fields.description }}</small>
      </li>
    </ul>

    <form @submit.prevent="createIssue">
      <h1>Create issue</h1>
      <input type="text" v-model="newIssueSummary" placeholder="Summary">
      <br />
      <textarea placeholder="Description" v-model="newIssueDesc"></textarea>
      <button type="submit">submit</button>
    </form>
  </div>
</template>

<style scoped>

</style>
