<script>
export default {
  name: "app",
  data() {
    return {
      issues: [],
      newIssueSummary: "",
      newIssueDesc: "",
      accessToken: null,
      projects: [],
      project: {},
      cloudids: [],
      cloudid: null,
      newProjectName: "",
      newProjectKey: ""
    }
  },
  methods: {
    createIssue() {
      const requestBody =
        `{
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

    getIssues(project) {
      const { id } = project
      fetch(`https://api.atlassian.com/ex/jira/${this.cloudid}"/rest/api/3/search?jql=project=${id}`,
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

    getProjects(cloudid) {
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
          this.projects = data
          console.log("projects", this.projects)

          /* Get first project */
          this.setProject(this.projects[0].self)
        });
    },

    getUser(userId) {
      fetch(`https://api.atlassian.com/ex/jira/${this.cloudid}/rest/api/3/users?accountId=${userId}`,
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
          console.log("user", data)
        });
    },

    setProject(url) {
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
          this.project = data
          console.log("this project", this.project)
          this.getIssues(this.project)
        });
    },

    signIn(params) {
      this.accessToken = params.token
      this.cloudids = [...params.data]
      console.log(this.cloudids)
      this.cloudid = this.cloudids[0].id
      console.log("cloudids", this.cloudids)

      // this.getUser();
      this.getProjects(this.cloudid)
    },

    createProject() {
      const bodyData =
        `{
          "name": "${this.newProjectName}",
          "key": "${this.newProjectKey}",
          "leadAccountId": "5e3abdfd387bb00cb2bc04eb",
          "projectTypeKey": "software",
          "projectTemplateKey": "com.pyxis.greenhopper.jira:gh-simplified-agility-kanban"
        }`;

      fetch(`https://api.atlassian.com/ex/jira/${this.cloudid}/rest/api/2/project`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${this.accessToken}`
          },
          body: bodyData
        })
        .then((response) => response.json())
        .then((data) => {
          console.log("create res", data)
          this.getProjects(this.cloudid)
        });
    }
  },
  mounted() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("q")) this.signIn(JSON.parse(decodeURIComponent(params.get("q"))))

    fetch(`https://api.atlassian.com/ex/jira/${this.cloudid}/rest/api/3/users/search`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${this.accessToken}`
        },
      })
      .then((response) => response.json())
      .then((data) => {
        console.log("user res", data)
      });

  }
}
</script>

<template>
  <div>
    <a
      href="https://auth.atlassian.com/authorize?audience=api.atlassian.com&client_id=f0rb1sOMiQ9pPK860ygqqZ87hKHfHeyx&scope=read%3Ajira-work%20manage%3Ajira-project%20manage%3Ajira-configuration%20read%3Ajira-user%20write%3Ajira-work&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fcallback&state=teststate&response_type=code&prompt=consent">login</a>
    <div>
      <p><i>Projects</i></p>
      <button v-for="project in projects" :key="project.id" @click="setProject(project.self)">
        {{ project.name }}
      </button>
    </div>
    <form @submit.prevent="createProject">
      <h1>Create project</h1>
      <input type="text" v-model="newProjectName" placeholder="Name">
      <br />
      <input type="text" v-model="newProjectKey" placeholder="Key">
      <br />
      <button type="submit">submit</button>
    </form>

    <!-- <button @click="getUser('5e3abdfd387bb00cb2bc04eb')">get user</button> -->

    <!-- OBS -- Der står localhost callback URL i URL'ets params -->
    <h1>Issues</h1>
    <ul>
      <li v-for="issue in issues" :key="issue.id">
        <strong>{{ issue.key }} : {{ issue.fields.summary }}</strong>
        <br />
        <div v-if="issue.fields.description && issue.fields.description.content.length">
          <small v-for="(desc, index) in issue.fields.description.content" :key="index">
            <p v-for="(text, index) in desc.content" :key="index">{{ text.text }}</p>
          </small>
        </div>
      </li>
    </ul>

    <form @submit.prevent="createIssue">
      <h1>Create issue</h1>
      <input type="text" v-model="newIssueSummary" placeholder="Summary">
      <br />
      <textarea placeholder="Description" v-model="newIssueDesc"></textarea>
      <br />
      <button type="submit">submit</button>
    </form>

  </div>
</template>

<style scoped>

</style>
