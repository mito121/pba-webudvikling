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
      const requestBody = `{
                            "update": {},
                            "fields": {
                              "summary": "${this.newIssueSummary}",
                              "issuetype": {
                                "id": "${this.project.issueTypes[0].id}"
                              },
                              "project": {
                                "id": "${this.project.id}"
                              },
                              "description": {
                                "type": "doc",
                                "version": 1,
                                "content": [
                                  {
                                    "type": "paragraph",
                                    "content": [
                                      {
                                        "text": "${this.newIssueDesc}",
                                        "type": "text"
                                      }
                                    ]
                                  }
                                ]
                              }
                            }
                          }`
      fetch(`https://api.atlassian.com/ex/jira/${this.cloudid}/rest/api/3/issue/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${this.accessToken}`
          },
          body: requestBody,
        })
        .then((response) => response.json())
        .then((data) => {
          /* Add issue to list */
          this.addIssue(data.self)
        })
    },

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

    addIssue(url) {
      fetch(url,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${this.accessToken}`
          },

        })
        .then((response) => response.json())
        .then((data) => {
          this.issues = [data, ...this.issues]
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
