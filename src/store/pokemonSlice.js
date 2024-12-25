import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPokemons = createAsyncThunk('pokemon/fetchPokemons', async () => {

  const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100');
  const pokemons = response.data.results;

  const detailedPokemons = await Promise.all(
    pokemons.map(async (pokemon) => {
      const details = await axios.get(pokemon.url);
      return {
        name: details.data.name,
        types: details.data.types.map((type) => type.type.name),
        image: details.data.sprites.front_default,
      };
    })
  );
  
  return detailedPokemons;
});

const initialState = {
  pokemons: [],
  filteredPokemons: [],
  status: 'idle',
  filter: 'all',
};

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    setFilter(state, action) {
      state.filter = action.payload;
    },
    setFilteredPokemons(state, action) {
      state.filteredPokemons = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemons.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPokemons.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.pokemons = action.payload;
        state.filteredPokemons = action.payload;
      })
      .addCase(fetchPokemons.rejected, (state) => {
        state.status = 'failed';
      });
  },
});


export const { setFilter, setFilteredPokemons } = pokemonSlice.actions;

export default pokemonSlice.reducer;