# (n)Puzzle Code Exercise

Build a fresh take on the classic sliding puzzle game. You can do this in
whatever language you like but make sure it is presented on some sort of
modern UI platform (i.e. web, android, iOS).

# Solution Outline

Minimum Requirements:

1. Present a solvable puzzle to the end user. Ensure that the user does not
see a puzzle combination that can't be solved.

2. Add a hint button that tells the user the next best step if they get stuck.

3. If the user decides to give up, there should be a way for them to see the
sequence of moves needed to solve the puzzle.

4. Detect when the puzzle is solved and notify the user in some way.

Additional Possible Features:

1. Allow the user to select between a few different puzzle sizes (3x3, 4x4, etc)

2. Animate tiles when moving.

3. Keep track of the number of moves used to solve a puzzle.

4. Keep track of those scores per user, create high score board (persist how
you like).

5. Use famous images (paintings, pictures, public figures) as the tiles instead
of just numbers.

6. Anything else you can think of.

*Example Board*

![Image of Example Puzzle]
(https://gm1.ggpht.com/UKXzytDUIfVHFu_58l4-S2ii5nd96tN7Bdcce3DXNJOWXpx9udHbZn-VVZVKb498Vzde5did0aCwapzy-h2B9H2l3VGITBfD0P-ODIisM6GsbcNqLfvvYCAbQtwu6UW3OIWMeGg4GfOljWrhC2ZTNrEjms6xe_PD4EJiXij0Zynev3XnHBuqtkajPbXFe0NvGbghEvfrirc5fQ09ZnCHLIAKTH7_2wK1VgZNGpw0C1zZiMqQJThsK_N_zjG_sQX9pFoPAyXY-2rweKMIl0YqYLNuGyha45OU6gUWSirC4PmFIHRooerM71gWJTy8BCPw4rW0fWXux4V61alUL7OCAsfoyUdH6suabUdifTfLzWuR1QKflNsgTG2U7nOtOAetageGJecu0zcz4sI5o09MH55nu_IWI1f_Hq7g1YGNyaVXWBicM2GB11SxvdK2AHN7_EKBXjeCKiXq-a-VkvJlt3OyEBM7JRVOaHOpyL8zhF6jDLEcB2YyDEqYMFv6YLUyJE8ECOrh776h8bUtzd0A3f3GBt5JL1OG_TMV4Y138T1ow4eE1ChCJofRAldlcL9ziTK9025cn4ml4ktCJyC4l-fQeRl7lmg3AaodAvuaPmrIOks7ZiLGl0oW7Wrht4sARk2nS7AE8Peq7FHS5RVcVw11GrDUsGyZa32Uj7gWSUNrMRcbUqUf_QPIgCZKBqc=s0-l75-ft-l75-ft)

# Application Architecture

The entire application runs on Node.js, for the application server,
React, as the View Layer for the User Interface, and Redux as the
central store that updates application state. Go [here for more information on Redux](http://redux.js.org/)
and [here for more information on React](https://facebook.github.io/react/).

The application uses [Gulp.js](http://gulpjs.com/), an automation tool,
along with [Webpack](https://webpack.github.io/) to bundle the Javascript
modules for the browser. Currently, our application does not optimize by
minifying the Styles and Javascripts.

Directory structure:

* `public/` - Contains the `js` and `css` directories that are built.
* `docs/` - Additional documentation about setting up the app
* `src/` - Contains all of the code for the application
* `src/app/` - The entirety of the application, including the lib for
solving the puzzle is included in this directory.
* `src/actions/` - Define the action and action types for our Redux store
* `src/components/` - All the visual UI components
* `src/reducers/` - Defines the pure functions that update our application state.
* `src/router/` - Defines the React Router
* `src/app.js` - Defines the React route that is injected into `index.html` via the `root`'
* `src/store.js` - Defines the Redux store, and combines each of the applications'
reducers so that there is one central application state.

* `src/game-solver-lib/` - Game Library that uses Priority Queue along
with A* algorithm to find the shortest possible solution.

* `server.js` - Initializes our http server
* `webpack.config.js` - Webpack configuration file

Currently the board configurations available are:
* 2x2
* 3x3
* 4x4
* 5x5


# Setting up the Application - Installation

See the [doc](docs/environment-setup.md)

# Running the Application

*These instructions assume you have already set up the app.*

From the project root, run:

```
$> node node_modules/gulp/bin/gulp.js serve

$> node node_modules/gulp/bin/gulp.js watch
```

And in a browser, open:

``` localhost:8080/```

# Features In Progress

1. Unit Tests
2. Making a CLI tool for the `game-solver-lib`

