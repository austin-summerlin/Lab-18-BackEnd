export function formatSquirrels(data) {
  return data.map(squirrel => {
    return {
      hectare: squirrel.hectare,
      shift: squirrel.shift,
      date: squirrel.date,
      stories: squirrel.note_squirrel_park_stories,
      experience: squirrel.story_topic_park_experience,
      animals: squirrel.story_topic_other_animals,
      other: squirrel.story_topic_other,
      poems: squirrel.story_topic_accidental_poems
    };
  });
}