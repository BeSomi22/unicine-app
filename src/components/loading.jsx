import React from 'react';
import { CircleLoader } from 'react-spinners';

const styles ={
    loadingContainer:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
    },
};

export default function Loading() {
  return (
    <div>
      <div style={styles.loadingContainer}>
        <CircleLoader color='#bc1823' loading={true} size={120} />
      </div>
    </div>
  )
}
