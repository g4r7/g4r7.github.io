- https://gnu.org/software/gnubg
- https://github.com/hwatheod/gnubg-web

# commands & responses

## play

- `new session`     -> `A new session has been started.`
- `new match $n`    -> `A new $n point match has been started.`

- `roll`            -> `gnubg rolls $n1, somebody rolls $n2.`
-                   -> `somebody rolls $n1 $n2`

- `move ($x1/$x2)+` -> `Illegal or unparsable move.`
- `double`          -> `gnubg accepts the cube at $n.`
-                   -> `gnubg accepts and immediately redoubles to $n.`
- doNextTurn        -> `somebody cannot move.`
                    -> `gnubg cannot move.`
-                   -> `gnubg moves ($x1/$x2\*?)+.`
                    -> `gnubg moves ($x1/$x2)\($n\) ...`
-                   -> `gnubg doubles.`
- `reject`          -> `somebody refuses the cube and gives up 2 points.`
-                   -> `gnubg wins a single game and 2 points.`
-                   -> `The score (after 1 game) is: gnubg 2, somebody 0 (match to 3 points, Crawford game).`
- `accept`          -> `somebody accepts the cube at $n.`
- `beaver`          ->
- `resign $n`       ->

## edit

- initialize engine
  - `set seed 2` first dice roll is 3 2
    - `p-idx 0` giving gnubg/blue/player-0 first move
    - `pos` and assigning it the positive integers
    - `simple[1] = pnt-1` and starting the `set board simple ...` num-seq with
      point-1 at index `1`, and `0` as the bar
  - `set player 0 human`
  - `new match 1`

  - init the board relative to p0 (simple[1] = p0's pnt-1), set the turn, THEN
    the dice for the turn

    ```txt
    set confirm default yes;
    set seed 2;
    set player 0 human;
    new match 1;
    set turn 0;
    set board simple 0 1 -2 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0;
    set turn 0;
    set dice 2 4;
    hint
    ```

- `set turn 0`
- `set board simple 0 -2 0 0 0 5 0 0 3 0 0 0 5 -5 0 0 0 3 0 5 0 0 0 0 -2 0`
- `set dice 1 2`
- `hint` -> 19/17 19/15

- `set turn 1`
- `set board simple 0 2 0 0 0 0 -5 0 -3 0 0 0 5 -5 0 0 0 3 0 5 0 0 0 0 -2 0`
- `set dice 1 2`
- `hint` -> 19/18 19/17

- CommandSetBoard
  - https://github.com/hwatheod/gnubg-web/blob/master/gnubg/set.c#L574
  - https://github.com/hwatheod/gnubg-web/blob/master/gnubg/commands.inc#L1107
    - `set board simple 3 2 4 0 -3 -5 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2`
    - `set board 4PPgASjgc/ABMA`
    - `set board PPGPAABAAAPHNNAAAAAA`
    - 1-2  `set board simple 0 1 -2 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0`
    - init `set board simple 0 -2 0 0 0 0 5 0 3 0 0 0 -5 5 0 0 0 -3 0 -5 0 0 0 0 2 0`

- `set confirm default yes`

- `set turn {0 1}`

- `set rng manual` (leads to STDIN prompt)
- `set cheat enable {on/off}`
- `set cheat player 1 roll 5` -> `somebody will get the 5th best roll on each turn.`
- `set automatic roll off`

# Available commands  

- accept     Accept a cube or resignation
- agree      Agree to a resignation
- analyse    Run analysis
- end        Automatically make plays
- beaver     Synonym for `redouble`
- clear      Clear information
- cmark      Mark candidates
- copy       Copy current position to clipboard
- decline    Decline a resignation
- dicerolls  Generate a list of rolls
- double     Offer a double
- drop       Decline an offered double
- eq2mwc     Convert normalised money equity to match winning chance
- *eval*     Display evaluation of a position
- export     Write data for use by other programs
- first      Goto first move or game
- help       Describe commands
- *hint*     Give hints on cube action or best legal moves
- invert     invert match equity tables, etc.
- import     Import matches, games or positions from other programs
- list       Show a list of games or moves
- *load*     Read data from a file
- move       Make a backgammon move
- mwc2eq     Convert match winning chance to normalised money equity
- new        Start a new game, match or session
- next       Step ahead within the game
- pass       Synonym for `drop`
- play       Force the computer to move
- previous   Step backward within the game
- redouble   Accept the cube one level higher than it was offered
- reject     Reject a cube or resignation
- relational Log matches to an external relational database
- resign     Offer to end the current game
- roll       Roll the dice
- rollout    Have gnubg perform rollouts of the current position.
- save       Write data to a file
- *set*      Modify program parameters
- show       View program parameters
- swap       Swap players
- take       Agree to an offered double
- ?          Describe commands

## set - Modify program parameters

- *analysis*       Control parameters used when analysing moves
- *automatic*      Perform certain functions without user input
- beavers          Set whether beavers are allowed in money game or not

- *board*          Set up the board in a particular position. Accepted formats are:

  - `set board =2` (sets the board to match the second position in the hint list.)
  - `set board simple 3 2 4 0 -3 -5 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 2`
  - `set board 4PPgASjgc/ABMA` (sets the board to match the position ID.)
  - `set board PPGPAABAAAPHNNAAAAAA` (sets the board to match the gnubg-nn position string.)

- cache            Set the size of the evaluation cache
- calibration      Specify the evaluation speed to be assumed for time estimates
- *cheat*          Control GNU Backgammon's manipulation of the dice
- clockwise        Control the board orientation
- *confirm*        Confirmation settings
- crawford         Set whether this is the Crawford game
- cube             Set the cube owner and/or value
- cubeefficiency   Set parameters for cube evaluations
- delay            Limit the speed at which moves are made
- *dice*           Select the roll for the current move
- *evaluation*     Control position evaluation parameters
- export           Set settings for export
- gotofirstgame    Control whether you want to go to the first or last game when loading matches or sessions
- import           Set settings for import
- invert           Invert match equity table
- jacoby           Set whether to use the Jacoby rule in money games
- defaultnames     Set default names for players
- aliases          Set aliases for player 1 when importing MAT files
- lang             Set your language preference
- matchid          set Match ID
- gnubgid          set GNUbg ID
- xgid             set GNUbg ID from XGID
- matchinfo        Record auxiliary match information
- matchlength      Specify the default length for new matches
- met              Synonym for `set matchequitytable`
- output           Modify options for formatting results
- player           Change options for one or both players
- postcrawford     Set whether this is a post-Crawford game
- priority         Set the priority of gnubg
- prompt           Customise the prompt gnubg prints when ready for commands
- ratingoffset     Set rating offset used for estimating abs. rating
- *rng*            Select the random number generator algorithm
- rollout          Control rollout parameters
- score            Set the match or session score
- *seed*           Set the dice generator seed
- styledgamelist   Display colours for marked moves in game window
- *turn*           Set which player is on roll
- tutor            Control tutor setup
- variation        Set which variation of backgammon is used

#### set evaluation movefilter - Set parameters for choosing moves to evaluate

Usage: `set evaluation movefilter <ply> <num.xjoin to accept (0 = skip)> [<num. of extra moves to accept> <tolerance>]`

- predefined settings (skill levels)
  - https://github.com/hwatheod/gnubg-web/blob/master/gnubg/eval.c#L317
  - https://www.mail-archive.com/bug-gnubg@gnu.org/msg02514.html
  - https://www.mail-archive.com/bug-gnubg@gnu.org/msg02518.html
    I set evaluation and analysis parameters to 'world class', by the
    following commands (maybe some unnecessary because default):

        set evaluation chequerplay type evaluation
        set evaluation chequerplay evaluation plies 2
        set evaluation chequerplay evaluation cubeful on
        set evaluation chequerplay evaluation prune on

        set evaluation movefilter 1 0  0 8 0.160000
        set evaluation movefilter 2 0  0 8 0.160000
        set evaluation movefilter 2 1 -1 0 0.000000
        set evaluation movefilter 3 0  0 8 0.160000
        set evaluation movefilter 3 1 -1 0 0.000000
        set evaluation movefilter 3 2  0 2 0.040000
        set evaluation movefilter 4 0  0 8 0.160000
        set evaluation movefilter 4 1 -1 0 0.000000
        set evaluation movefilter 4 2  0 2 0.040000
        set evaluation movefilter 4 3 -1 0 0.000000

        set evaluation cubedecision type evaluation
        set evaluation cubedecision evaluation plies 2
        set evaluation cubedecision eval prune on

        ---

        set analysis chequerplay type evaluation
        set analysis chequerplay eval plies 2
        set analysis chequerplay evaluation cubeful on
        set analysis chequerplay evaluation prune on

        set analysis movefilter 1 0  0 8 0.160000
        set analysis movefilter 2 0  0 8 0.160000
        set analysis movefilter 2 1 -1 0 0.000000
        set analysis movefilter 3 0  0 8 0.160000
        set analysis movefilter 3 1 -1 0 0.000000
        set analysis movefilter 3 2  0 2 0.040000
        set analysis movefilter 4 0  0 8 0.160000
        set analysis movefilter 4 1 -1 0 0.000000
        set analysis movefilter 4 2  0 2 0.040000
        set analysis movefilter 4 3 -1 0 0.000000

        set analysis cubedecision type evaluation
        set analysis cubedecision evaluation plies 2
        set analysis cubedecision eval prune on

#### set output <subcommand>

- output          Print to messages to stdout
- matchpc         Show match equities as percentages (on) or probabilities (off)
- mwc             Show output in MWC (on) or equity (off) (match play only)
- rawboard        Give FIBS "boardstyle 3" output (on), or an ASCII board (off)
- winpc           Show winning chances as percentages (on) or probabilities (off)
- digits          Set number of digits after the decimal point in outputs
- errorratefactor The factor used for multiplying error rates

#### help set rollout <subcommand>

- bearofftruncation  Control truncation of rollout when reaching bearoff databases
- chequerplay        Specify parameters for chequerplay during rollouts
  - cubeful          Cubeful evaluations
    - `set rollout chequerplay cubeful on|off`
  - deterministic    Specify whether added noise is determined by position
  - noise            Distort evaluations with noise
    - `set rollout chequerplay noise 0.5`
  - plies            Choose how many plies to look ahead
  - prune            use fast pruning networks
- cubedecision       Specify parameters for cube decisions during rollouts
- cube-equal-chequer Use same rollout evaluations for cube and chequer play
- cubeful            Specify whether the rollout is cubeful or cubeless
  - `set rollout cubeful off`
- initial            Roll out as the initial position of a game
- jsd                Stop truncations based on j.s.d. of equities
- later              Control evaluation parameters for later plies of rollout
- limit              Stop rollouts based on Standard Deviations
- log                Enable recording of rolled out games
- logfile            Set template file name for rollout .sgf files
- movefilter         Set parameters for choosing moves to evaluate
- player             Control evaluation parameters for each side individually
- players-are-same    Use same settings for both players in rollouts
- quasirandom        Permute the dice rolls according to a uniform distribution
- rng                Specify the random number generator algorithm for rollouts
- rotate             Synonym for `quasirandom`
- seed               Specify the base pseudo-random seed to use for rollouts
- trials             Control how many rollouts to perform
- truncation         Set parameters for truncating rollouts
- truncate-equal-player0    Use player 0 settings for rollout evaluation at truncation point
- varredn            Use lookahead during rollouts to reduce variance

#### help set evaluation <subcommand>

https://www.gnu.org/software/gnubg/manual/html_node/Evaluation-settings.html#Evaluation-settings

- chequerplay    Set evaluation parameters for chequer play
  - type         Specify type (evaluation or rollout)
    - `set evaluation chequerplay type rollout|evaluation`
  - evaluation      Specify parameters for neural net evaluation
    - chequerplay        Set evaluation parameters for chequer play
    - cubedecision       Set evaluation parameters for cube decisions
    - movefilter         Set parameters for choosing moves to evaluate
    - sameasanalysis     Select if evaluation settings should be the same as the analysis setting
  - rollout         Specify parameters for rollout
    - bearofftruncation  Control truncation of rollout when reaching bearoff databases
    - chequerplay        Specify parameters for chequerplay during rollouts
    - cubedecision       Specify parameters for cube decisions during rollouts
    - cube-equal-chequer Use same rollout evaluations for cube and chequer play
    - cubeful            Specify whether the rollout is cubeful or cubeless
      - `set evaluation chequerplay rollout cubeful on|off`
    - initial            Roll out as the initial position of a game
    - jsd                Stop truncations based on j.s.d. of equities
    - later              Control evaluation parameters for later plies of rollout
    - limit              Stop rollouts based on Standard Deviations
    - log                Enable recording of rolled out games
    - logfile            Set template file name for rollout .sgf files
    - movefilter         Set parameters for choosing moves to evaluate
    - player             Control evaluation parameters for each side individually
    - players-are-same   Use same settings for both players in rollouts
    - quasirandom        Permute the dice rolls according to a uniform distribution
    - rng                Specify the random number generator algorithm for rollouts
    - rotate             Synonym for `quasirandom`
    - seed               Specify the base pseudo-random seed to use for rollouts
    - trials             Control how many rollouts to perform
    - truncation         Set parameters for truncating rollouts
    - truncate-equal-player0    Use player 0 settings for rollout evaluation at truncation point
    - varredn            Use lookahead during rollouts to reduce variance

- cubedecision   Set evaluation parameters for cube decisions

- movefilter     Set parameters for choosing moves to evaluate
  - `set evaluation movefilter <ply> <num.xjoin to accept (0 = skip)> [<num. of extra moves to accept> <tolerance>]`

- sameasanalysis Select if evaluation settings should be the same as the analysis setting
  - `set evaluation sameasanalysis on|off`

#### set analysis <subcommand>

- chequerplay   Specify parameters for the analysis of chequerplay
- cube          Select whether cube action will be analysed
- cubedecision  Specify parameters for the analysis of cube decisions
- luck          Select whether dice rolls will be analysed
- luckanalysis  Specify parameters for the luck analysis
- movefilter    Set parameters for choosing moves to evaluate
- moves         Select whether chequer play will be analysed
- player        Player specific options
- threshold     Specify levels for marking moves
