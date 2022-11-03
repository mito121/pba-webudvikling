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
            Authorization: 'Basic ' + btoa('rasm5970@edu.ucl.dk' + ":" + import.meta.env.VITE_JIRA_TOKEN)
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
            Authorization: 'Basic ' + btoa('rasm5970@edu.ucl.dk' + ":" + import.meta.env.VITE_JIRA_TOKEN)
          },

        })
        .then((response) => response.json())
        .then((data) => {
          const { issues } = data
          this.issues = issues
        });
    },
  },
  mounted() {
    this.getIssues()
    const params = new URLSearchParams(window.location.search);
    if (params.get("q")) console.log("lol", JSON.parse(decodeURIComponent(params.get("q"))))


  }
}
</script>

<template>
  <div>
    <!-- OBS -- Der står localhost callback URL i URL'ets params -->
    <a
      href="https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=f0rb1sOMiQ9pPK860ygqqZ87hKHfHeyx&scope=read%3Ajira-work%20manage%3Ajira-project%20manage%3Ajira-configuration%20read%3Ajira-user%20write%3Ajira-work&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback&state=teststate&response_type=code&prompt=consent">login</a>
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
