
const host = 'http://localhost:3001';

function App() {
  return (
    <div className='main'>
      <video>
        <source src={`${host}/videos/1`}>
        </source>
      </video>
    </div>
  );
}

export default App;
