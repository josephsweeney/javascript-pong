Canvas Pong
===========

This is an open source implementation of pong in javascript where I wrote my own AI to play as the left paddle. The learning technique I used was creating a set of features from the state of the game, then learned weights for each feature to determine whether or not to move the paddle up, down, or stop it completely. The learning was done with simulated annealing, a stochastic algorithm that allows us to probabilistically choose weights based on their performance. This method realies on two main implementations, the energy/acceptance probability function which returns the probability that we accept a candidate set of weights, and a candidate generator. 

The candidate generator I started with wasn't very effective, it chose a random factor between -2 and 2 and multiplied my current weights by that factor. This led to some extremely high valued weights which performed terribly. I eventually settled on randomly choosing a value 0, -1, or 1 for each weight and adding it to my current weight. This limited my search space to integer-valued weights, but i think that made it easier to find weights that are actually decent.

My acceptance probability depended on what I called the energy of a candidate, where lower energy meant the AI performed better in a game. I started off with the simple energy of playing one game with a set of weights, and the energy was their score minus my score. This didn't do well because the opponents ai was either too inconsistent so when I scored it was just luck, or too good so I could never score. 

The next approach I tried was switching to evaluating weights anytime anybody scored and the energy was the number of times I hit the ball times -1. This helped because I evaluated weights even faster, and it was a better metric for ability because the best way to play pong is to be able to hit the ball well. The problem that arose was we would end up accepting terrible candidates because the probabilty of accepting candidates that never hit the ball was too high if we had a candidate that could hit the ball once or twice. This meant we spent most of our time looking and accepting bad candidates, instead of finding the ones that could actually hit the ball.

I ended up changing the energy so that if a candidate never hit the ball, it got a penalty of 10 energy which made it much more unlikely to pick a cnadidate that never hit the ball. This meant we spent most of our time looking at candidates that actually hit the ball and eventually converged to a pretty good player. This led to convergence to a set of weieghts that had a volley with the perfect opponent ai of over 300 hits! 

Other changes I made were to the game were so the built in AI played perfectly by predicting where the ball would hit, and multiplying the speed of the game by 10 so I could evaluate more candidates. I used local browser storage to store weights between games and different AI implementations. 

