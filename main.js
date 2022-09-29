Vue.component("login", {
  template:
  `<div class="login">
    <img class="login-logo" src="images/carrot-icon.png" alt="logo">
    <h1>Welcome to My Patch</h1>
    <h4>Sign in to your account or <u style="cursor: pointer" v-on:click="$emit('set_page', 'register')">register a new account here</u>.</h4>
    <label for="username">Username</label>
    <input type="text" id="username" name="username" required="required" v-focus/>
    <label for="password">Password</label>
    <input type="password" id="password" name="password" required="required"/>
    <h4 style="cursor: pointer" v-on:click="$emit('set_page', 'forgot')" class="red">Forgot password</h4>
    <button style="cursor: pointer" v-on:click="$emit('sign_in')">Login</button>
  </div>`
});

Vue.component("register", {
  template:
  `<div class="login">
    <img class="login-logo" src="images/carrot-icon.png" alt="logo">
    <h1>Welcome to My Patch</h1>
    <h4>Register a new account</h4>
    <label for="name">Name</label>
    <input type="text" id="name" name="name" required="required"/>
    <label for="email">Email Address</label>
    <input type="text" id="email" name="email" required="required"/>
    <label for="password">Password</label>
    <input type="password" id="password" name="password" required="required"/>
    <button style="cursor: pointer" v-on:click="$emit('set_page', 'login')">Register Account</button>
  </div>`
});

Vue.component("forgot", {
  template:
  `<div class="login">
    <img class="login-logo" src="images/carrot-icon.png" alt="logo">
    <h1>Welcome to My Patch</h1>
    <h4>Forgot your password? Enter your email and will send you a link to reset your password.</h4>
    <label for="username">Email Address</label>
    <input type="text" id="email" name="email" />
    <button style="cursor: pointer" v-on:click="$emit('set_page', 'login')">Reset Password</button>
  </div>`
});

Vue.component("dashboard", {
  props: ["todo", "alerts", "tips"],
  template: `<div class="dashboard">
    <div class="dashboard-section">
      <div>
        <i class="fa-sharp fa-solid fa-check-circle"></i>
        <h4>Todo in your patch</h4>
      </div>
      <ul>
        <li v-for="item in todo">{{item}}</li>
      </ul>
    </div>
    <hr />
    <div class="dashboard-section">
      <div>
        <i class="fa-sharp fa-solid fa-warning"></i>
        <h4>Alerts</h4>
      </div>
      <ul>
        <li v-for="item in alerts">{{item}}</li>
      </ul>
    </div>
    <hr />
    <div class="dashboard-section">
      <div>
        <i class="fa-sharp fa-solid fa-star"></i>
        <h4>Tips</h4>
      </div>
      <ul>
        <li v-for="item in tips">{{item}}</li>
      </ul>
    </div>
  </div>`,
});

Vue.component("my-patches", {
  props: ["patches"],
  template: `<div class="patches">
    <h2>My patches</h2>
    <div v-for="(item, index) in patches" style="cursor: pointer" v-on:click="$emit('set_page', 'edit-patch', index)" >{{item.name}}</div>
  </div>`,
});

Vue.component("edit-patch", {
  props: ["patches", "patch_id"],
  data() {
    return this.patches[this.patch_id];
  },
  template: `<div class="new-patch">
    <h2>Edit {{this.name}}</h2>
    <div class="patch-form">
      <label for="patch-name">Patch Name</label>
      <input type="text" id="patch-name" name="patch-name" v-model="name"/>
      <label for="patch-width">Patch Width</label>
      <input type="number" id="patch-width" name="patch-width" v-model="columns" v-on:change="build_array"/>
      <label for="patch-height">Patch Height</label>
      <input type="number" id="patch-height" name="patch-height" v-model="rows" v-on:change="build_array"/>
    </div>
    <div class="patch-viewer">
      <div class="patch-viewer-row" v-for="(row, i) in patch_layout">
        <div class="patch-viewer-cell" v-for="(square, j) in row" style="cursor: pointer" v-on:click="active_square = square">
          <img v-if="!!square.plant" v-bind:src="'images/' + plants.find((plant) => square.plant === plant.name).icon" v-bind:alt="square.plant.name" />
        </div>
      </div>
    </div>
    <div v-if="!!active_square" class="square-form">
      <label for="plant-name">Plant</label>
      <select id="plant-name" name="plant-name" v-model="active_square.plant">
        <option value="" disabled>Select plant</option>
        <option v-for="plant in plants" v-bind:value="plant.name">{{plant.display}}</option>
      </select>
      <label for="plant-date">Date Planted</label>
      <input type="date" id="plant-date" name="plant-date" v-model="active_square.date_planted"/>
    </div>
    <div class="patch-form">
      <br><br><button style="cursor: pointer" v-on:click="$emit('set_page', 'my-patches')">Save Patch</button>
    </div>
  </div>`,
  methods: {
    build_array: function () {
      // Set columns and rows to new values
      this.columns = Math.max(1, parseInt(this.columns));
      this.rows = Math.max(1, parseInt(this.rows));
      // remove rows over new row count
      if (this.patch_layout.length > this.rows) {
        this.patch_layout.splice(this.rows);
        return;
      }
      // add rows up to new row count
      while (this.patch_layout.length < this.rows) {
        this.patch_layout.push(
          Array(this.columns).fill({
            plant: '',
            date_planted: new Date(),
          })
        );
      }
      this.patch_layout.forEach((row) => {
        // remove columns over new column count
        if (row.length > this.columns) {
          row.splice(this.columns);
          return
        }
        // add columns up to new column count
        while (row.length < this.columns) {
          row.push({
            plant: '',
            date_planted: new Date()
          });
        }
      });
    }
  }
});

Vue.component("new-patch", {
  data() {
    return {
      name: "New Patch",
      rows: 2,
      columns: 2,
      patch_layout: [
        [
          {
            plant: "",
            date_planted: new Date(),
          },
          {
            plant: "",
            date_planted: new Date(),
          },
        ],
        [
          {
            plant: "",
            date_planted: new Date(),
          },
          {
            plant: "",
            date_planted: new Date(),
          },
        ],
      ],
      active_square: null,
      plants: plants,
    };
  },
  template: `<div class="new-patch">
    <h2>Create a new patch</h2>
    <div class="patch-form">
      <label for="patch-name">Patch Name</label>
      <input type="text" id="patch-name" name="patch-name" v-model="name"/>
      <label for="patch-width">Patch Width</label>
      <input type="number" id="patch-width" name="patch-width" v-model="columns" v-on:change="build_array"/>
      <label for="patch-height">Patch Height</label>
      <input type="number" id="patch-height" name="patch-height" v-model="rows" v-on:change="build_array"/>
    </div>
    <div class="patch-viewer">
      <div class="patch-viewer-row" v-for="(row, i) in patch_layout">
        <div class="patch-viewer-cell" v-for="(square, j) in row" style="cursor: pointer" v-on:click="active_square = square">
          <img v-if="!!square.plant" v-bind:src="'images/' + plants.find((plant) => square.plant === plant.name).icon" v-bind:alt="square.plant.name" />
        </div>
      </div>
    </div>
    <div v-if="!!active_square" class="square-form">
      <label for="plant-name">Plant</label>
      <select id="plant-name" name="plant-name" v-model="active_square.plant">
        <option value="" disabled>Select plant</option>
        <option v-for="plant in plants" v-bind:value="plant.name">{{plant.display}}</option>
      </select>
      <label for="plant-date">Date Planted</label>
      <input type="date" id="plant-date" name="plant-date" v-model="active_square.date_planted"/>
    </div>
    <div class="patch-form">
      <br><br><button style="cursor: pointer" v-on:click="$emit('set_page', 'my-patches')">Save Patch</button>
    </div>
  </div>`,
  methods: {
    build_array: function () {
      // Set columns and rows to new values
      this.columns = Math.max(1, parseInt(this.columns));
      this.rows = Math.max(1, parseInt(this.rows));
      // remove rows over new row count
      if (this.patch_layout.length > this.rows) {
        this.patch_layout.splice(this.rows);
        return;
      }
      // add rows up to new row count
      while (this.patch_layout.length < this.rows) {
        this.patch_layout.push(
          Array(this.columns).fill({
            plant: '',
            date_planted: new Date(),
          })
        );
      }
      this.patch_layout.forEach((row) => {
        // remove columns over new column count
        if (row.length > this.columns) {
          row.splice(this.columns);
          return
        }
        // add columns up to new column count
        while (row.length < this.columns) {
          row.push({
            plant: '',
            date_planted: new Date()
          });
        }
      });
    }
  }
});

var patch_square = {
  plant: 'carrot',
  date_planted: new Date()
}

var plants = [
  {
    name: "beetroot",
    display: "Beetroot",
    icon: "beet-icon.png",
  },
  {
    name: "lettuce",
    display: "Lettuce",
    icon: "cabbage-icon.png",
  },
  {
    name: "carrot",
    display: "Carrot",
    icon: "carrot-icon.png",
  },
  {
    name: "chilli",
    display: "Chilli",
    icon: "chilli-pepper-icon.png",
  },
  {
    name: "corn",
    display: "Corn",
    icon: "corn-icon.png",
  },
  {
    name: "eggplant",
    display: "Eggplant",
    icon: "eggplant-icon.png",
  },
  {
    name: "garlic",
    display: "Garlic",
    icon: "garlic-icon.png",
  },
  {
    name: "potato",
    display: "Potato",
    icon: "potato-icon.png",
  },
  {
    name: "pumpkin",
    display: "Pumpkin",
    icon: "pumpkin-icon.png",
  },
  {
    name: "spinach",
    display: "Spinach",
    icon: "spinach-icon.png",
  },
  {
    name: "tomato",
    display: "Tomato",
    icon: "tomato-icon.png",
  }
];

const focus = {
  mounted: (el) => el.focus()
}

var vm = new Vue({
  el: "#app",
  data: {
    signed_in: false,
    current_page: "login",
    sidebar_open: false,
    patch_id: null,
    nav_items: [
      {
        name: "home",
        display: "Dashboard",
      },
      {
        name: "my-patches",
        display: "My Patches",
      },
      {
        name: "new-patch",
        display: "Add New Patch",
      },
      {
        name: "settings",
        display: "Settings",
      }
    ],
    todo: [
      "Water 'North Patch'",
      "Harvest carrots in 'West Patch'",
      "Check gardens after a windy night"
    ],
    alerts: [
      "Severe storm approaching"
    ],
    tips: [
      "Time to prune your fruit tress",
      "Try using netting to cover your leafy greens to help protect against moths"
    ],
    patches: [
      {
      name: "South Patch",
      rows: 2,
      columns: 2,
      patch_layout: [
        [
          {
            plant: "carrot",
            date_planted: new Date(),
          },
          {
            plant: "lettuce",
            date_planted: new Date(),
          },
        ],
        [
          {
            plant: "corn",
            date_planted: new Date(),
          },
          {
            plant: "spinach",
            date_planted: new Date(),
          },
        ],
      ],
      active_square: null,
      plants: plants,
    },
    {
      name: "North Patch",
      rows: 3,
      columns: 3,
      patch_layout: [
        [
          {
            plant: "lettuce",
            date_planted: new Date(),
          },
          {
            plant: "lettuce",
            date_planted: new Date(),
          },
          {
            plant: "lettuce",
            date_planted: new Date(),
          },
        ],
        [
          {
            plant: "carrot",
            date_planted: new Date(),
          },
          {
            plant: "carrot",
            date_planted: new Date(),
          },
          {
            plant: "carrot",
            date_planted: new Date(),
          },
        ],
        [
          {
            plant: "potato",
            date_planted: new Date(),
          },
          {
            plant: "potato",
            date_planted: new Date(),
          },
          {
            plant: "potato",
            date_planted: new Date(),
          },
        ],
      ],
      active_square: null,
      plants: plants,
    },
    {
      name: "West Patch",
      rows: 2,
      columns: 2,
      patch_layout: [
        [
          {
            plant: "carrot",
            date_planted: new Date(),
          },
          {
            plant: "lettuce",
            date_planted: new Date(),
          },
        ],
        [
          {
            plant: "corn",
            date_planted: new Date(),
          },
          {
            plant: "spinach",
            date_planted: new Date(),
          },
        ],
      ],
      active_square: null,
      plants: plants,
    }
    ]
  },
  methods: {
    sign_in: function() {
      this.signed_in = true;
      this.current_page = "home";
    },
    logout: function() {
      this.signed_in = false;
      this.current_page = "login";
    },
    set_page: function (page, patch_id = null) {
      if (page === 'edit-patch') {
        this.patch_id = patch_id;
      }
      this.current_page = page;
    },
    toggle_sidebar: function() {
      this.sidebar_open = !this.sidebar_open;
    }
  }
});