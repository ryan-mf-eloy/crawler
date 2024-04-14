export default `
<style>
body {
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  font: 1rem "Roboto", sans-serif;
  background-color: #f0f0f5;
  padding: 4rem;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: inherit;
}

h1 {
  text-transform: uppercase;
}

div {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-auto-rows: 150px;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
  background-color: #fff;
  border-radius: 8px;
  padding: 0 1rem 2rem 1rem;
  gap: 1rem;
}
div div {
  max-height: 150px;
  min-height: 150px;
  width: 100%;
  border-radius: 8px;
  background-color: #f0f0f5;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
</style>
`