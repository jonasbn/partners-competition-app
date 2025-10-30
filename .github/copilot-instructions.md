# Introduction

This application is an experimental frontend built with React and Create React App. It is intended to demonstrate the structure and setup of a React application using Bootstrap for styling.

The application has been ported to Vite for improved performance and development experience.

The application visualizes gaming statistics for a game called "partners", including a leaderboard and game outcomes.

The game data is stored in a JSON file named `games.json`, which contains information about players, teams, scores, and game details.

The application should support the following features:

- Localization (i18n) for multiple languages
	- English
	- Danish
- Responsive design using Bootstrap components
- Dark and light mode themes

- Each player is represented by a name and an avatar
- The avatar can be rendered in 3 variations based on context, the context being:
	- ranking
	- game outcome
- The avatar assets should be stored in the `public/avatars` directory
- The avatar variations are as follows:
	- For ranking, there are 3 variations:
		- Good ranking (1st place): happy avatar
		- Average ranking (2nd-3rd place): neutral avatar
		- Poor ranking (4th place and below): sad avatar
	- For game outcome, there are 2 variations:
		- Win or first place: happy avatar
		- second place: neutral avatar
		- Loss or 3rd place: sad avatar
	
The tournament game data is stored in a JSON file named `games.json`, which contains information about players, teams, scores, and game details.

The game and tournament rules are as follows:

* a game consist of 3 participating teams
* each team will have a score
* a first place i 3 points
* a second place is 2 points
* a third place is 1 point
* each game will have a date and time
* each game will have an unique id
* each player will have a name
* There are 6 players in total
* the players are named:
  * Jonas
  * Torben
  * Gitte
  * Anette
  * Lotte
  * Peter
* each player will have a score per game
* each player will have a cumulative score
* each player will have a unique id
* a team consist of two players
* each player can play in multiple games
* each player are participating in a team per game

- All players are participating in every game, forming different teams each time
- A player can only be in one team per game

The application UI should present the following components all on a single page:

- First row of components in the form of cards with highlights:
	- Current leader
		- The avatar should be happy
	- Best team
		- The avartars should be happy
	- Game statistics
		- Total number of games played
		- Max number of points available in total (3 points per game times number of games played

- Second component with Leaderboard:
	- A table displaying the leaderboard with:
		- player names
		- avatars based on ranking
		- cumulative scores
		- number of games played
		- average score per game
		- win/game ratio for the player (wins per games played)

- Third component with Player Performance Analysis:
	- A table or chart showing each player's performance across games
	- Number of games played
	- Average score per game
	- Number of wins
	- The avatars should be based on ranking

- Fourth component with Game Calendar:
	- Count of total games played
	- Count of game days
	- Activity timeline
	- List of recent games with:
		- date
		- number of games played that day

- Fifth component with Team statistics:
	- A table showing team performance across games
	- Team names (based on player names)
	- Number of games played
	- Average team score
	- Number of wins
	- Number of second places
	- Number of third places
	- Win rate
	- The avatars should be based on ranking of team
	    - First, second and third place happy
		- Fourth place to ninth place neutral
		- Tenth place and below sad 

- Sixth component with Recent Game Outcomes:
	- A list or table of recent games played
	- Date and time of each game
	- Participating teams and their scores
	  - there are always 3 teams per game, that is a tournament rule
	- Game outcome (which team won, second place, third place)
	- No avatars needed here

- All other visual components should be removed, focusing solely on the above requirements.

# Application requirements

- The application should be built using React and Bootstrap
- The build system is Vite
- Unit-tests should be implemented using Vitest and React Testing Libraries
