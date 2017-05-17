export default function tagSuggestions (state = [], action) {
	switch (action.type) {
	case 'SET_GET_TAG_SUGGESTIONS':
		return action.payload.suggestions;
	default:
		return state;
	}
}
