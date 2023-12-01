import Editor from '../Editor';

const BubbleEditor = () => (
  <div
    className="standalone-container"
    style={{ margin: '50px auto', maxWidth: 720 }}
  >
    <Editor
      style={{ height: 350 }}
      config={{ placeholder: 'Compose an epic...', theme: 'bubble' }}
    />
  </div>
);

export default BubbleEditor;
