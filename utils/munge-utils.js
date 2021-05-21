export function formatSquirrels(data) {
  const arr = data.map(squirrel => {
    return [{
      hectare: squirrel.hectare,
      shift: squirrel.shift,
      date: squirrel.date,
      stories: squirrel.note_squirrel_park_stories,
      experience: squirrel.story_topic_park_experience,
      poems: squirrel.story_topic_accidental_poems
    }];
  });
  return arr[0];
}

