<script>
export default {
  name: "app",
  data() {
    return {
      issues: [],
      newIssueSummary: "",
      newIssueDesc: "",
      accessToken: null,
      jiraProjects: [],
      project: {},
      cloudids: [],
      cloudid: null
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

    // getIssues() {
    //   fetch(`http://localhost:3000/rest/api/2/search?jql=project=${this.project.key}&maxResults=1000`,
    //     {
    //       headers: {
    //         "Content-Type": "application/json",
    //         Accept: "application/json",
    //         // Authorization: 'Basic ' + btoa('rasm5970@edu.ucl.dk' + ":" + import.meta.env.VITE_JIRA_TOKEN)
    //         Authorization: `Bearer ${this.accessToken}`
    //       },

    //     })
    //     .then((response) => response.json())
    //     .then((data) => {
    //       const { issues } = data
    //       this.issues = issues
    //     });
    // },

    getIssues() {
      fetch(`https://api.atlassian.com/ex/jira/${this.cloudid}"/rest/api/3/search?jql=project=${this.project.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${this.accessToken}`
          },

        })
        .then((response) => response.json())
        .then((data) => {
          const { issues } = data
          this.issues = issues
          console.log("issues", this.issues)
        });
    },

    getProject(cloudid) {
      fetch(`https://api.atlassian.com/ex/jira/${cloudid}/rest/api/2/project`,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${this.accessToken}`
          },

        })
        .then((response) => response.json())
        .then((data) => {
          this.jiraProjects = data
          console.log("jira projects", this.jiraProjects)

          /* Get first project */
          fetch(this.jiraProjects[0].self,
            {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${this.accessToken}`
              },

            })
            .then((response) => response.json())
            .then((data) => {
              this.project = data
              console.log("this project", this.project)
              this.getIssues()
            });
        });
    },

    signIn(params) {
      this.accessToken = params.token
      this.cloudids = [...params.data]
      this.cloudid = this.cloudids[0].id
      console.log("cloudids", this.cloudids)

      // this.getUser();
      this.getProject(this.cloudid)
    }
  },
  mounted() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("q")) this.signIn(JSON.parse(decodeURIComponent(params.get("q"))))


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
      <li v-for="issue in issues" :key="issue.id">
        <strong>{{ issue.key }} : {{ issue.fields.summary }}</strong>
        <br />
        <div v-if="issue.fields.description && issue.fields.description.content.length">
          <small v-for="desc in issue.fields.description.content">
            <p v-for="text in desc.content">{{ text.text }}</p>
          </small>
        </div>
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
