# Make Effective Data Visualization

## Summary

This project visualizes a trimmed down subset of data from the [Lahman’s Baseball Database](http://www.seanlahman.com/baseball-archive/statistics/). The visualization shows the high proportion of baseball players who are left-handed and compares their performance (batting average and number of home run) to the remaining players.

## Design

### Bar Plot
The first decision made was to remove players with zero batting average. Since both performance indicators in the dataset have to do with batting, it does not make sense to include players that are not batters.

To compare the proportion of baseball players in each handedness
category a simple bar plot is used. After the first round of feedback, the order of the categories was changed to
have the left-handed players bar on the left side and the right-handed
players bar on the right side. This makes it more intuitive to analyse
the plot without needing to always look at the category labels.

### Box-Plots
To compare the batting average and home runs, box-plots are used. The
reason for this choice is the ability to convey a lot of information
in one single plot:

  * we can compare medians.
  * we can compare distributions.
  * we can visualize outliers.

Some people suggested in the feedback that the use of these plots
may not be the best since they are not so easy to interpret. That is a
fair point. But for this visualization I believe the benefits are worth it, and since the purpose of this project is also to learn about D3, it gives me the opportunity to create different kind of plot instead
of repeating bar plots.

Another person suggested than in the home runs box-plot the vertical axis should only extend until 250. This would allow to better visualize the boxes distribution and not get distracted by the high number of outliers on the upper range. Based on this suggestion, I opted to put a "zoom" button that allows to zoom in on the boxes and in this way we can see both the detail of the boxes and the outliers.

Also based on feedback, tooltips that show the median values appear when hovering the boxes with the mouse pointer. Additionally, the performance and names of the outliers appear when hovering the outlier circles.

## Feedback

### First version

Feedback A:
> I think narrative makes sense. It is clear you want to show that left-handed are
somewhat better at average. In my view you need title for the y-axis and red
line of a median is not very distinctive on a black box background on my screen.
Also, should there be some comparison of means? Just a thought.

Feedback B:
> I like your visualization.  I think the narrative is supported by the data.  My
only suggestion, visually, would be to re-order the columns with the left on the
left, switch hitters in the middle and right handers on the right. Perhaps it
would also  help to color code each of those populations and maintain those
colors throughout all of your charts. Very interesting data.  I had a feeling
that the % of left handed players was higher than that of the general
population, but had no idea that they had a higher avg batting average & HRs.

Feedback C:
>I think your visualization and story is very clear. Just two cents, I would
suggest rescale the y-axis of the last graph to the range between 0 and 250,
which would be more clear for the reader to see the difference between the
categories. I might also consider flip the axises of the first graph and enlarge
the categorical name for all and make it easier for user to read.

Feedback D:
>like your narration in general. Especially liked the way you give info for
non-baseball fans as well and end up with intriguing findings on why baseball
may be rigged for lefties! This being a explanatory visualization (as opposed to
exploratory) you may want to cut down on some stat lingo and showing stat heavy
box charts which require good amount of explanation to a non-stat person. On
visual front, I would suggest to use some color and find some way to bring these
charts together where reader can drill down themselves. May be a bubble chart
with home runs and batting average as its axis with color coding for handiness
might give visual clues to reader that left handers are better performers.﻿

Feedback E:
>Overall I find your visualization to be very understandable.  I agree with
[Feedback D] that boxplots might not be the best chart type to use, as they aren't
very understandable for the general public.  If you do decide to use them, I
would suggest cutting down on stat lingo and focus on the conclusion. Also, for
the boxplots it would be nice to be able to hover over and see the means.  You
could use the scatterplot like [Feedback D] suggested, or bar charts with ranges like
this:
https://plot.ly/~annabri128/12/results-error-bars-represent-interquartile-range.png
Hope that was helpful.

Feedback F:
>Very nice and clear!  Your data backs up your writing and makes it an easy read.
It would be nice to know whether the players are professional or novice.  My
guess would be professional because I don't think novice keep stats. Having a
label on the y axis might be nice for reusing the plots.

### Second version

_by 01.07.2016 10:29:00 CEST no feedback had been given for the second version_

## Resources
### Baseball resources:

http://psycnet.apa.org/journals/bul/84/3/385/

https://en.wikipedia.org/wiki/Batting_average#Major_League_Baseball

https://en.wikipedia.org/wiki/Home_run#Inside-the-park_home_run

http://www.livescience.com/2665-baseball-rigged-lefties.html

### D3 Bar plots

http://bl.ocks.org/mbostock/3019563

https://bost.ocks.org/mike/bar/3/

### D3 tooltips

http://bl.ocks.org/mbostock/1087001

https://github.com/caged/d3-tip
