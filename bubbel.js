function swapElement(arr, index1, index2) {
    [[arr[index1], arr[index2]]] = [arr[index2], arr[index1]];
  }
  
  function BubbleSort(arr) {
    for (let i = arr.length; i > 0; i--) {
      //yo chai like outer loop jasto ho
      for (let j = 0; j < i - 1; j++) {
        //yo chai array bhahira ho
        if (arr[j] > arr[j + 1]) {
          console.log("Comparing");
          console.log(arr[j], arr[j + 1]);
          let temp = arr[j];
          console.log(temp, 'temp value')
          arr[j] = arr[j + 1];
          console.log(arr[j],'j value')
          arr[j + 1] = temp;
          //swap(arr,j,j+1);
        }
      }
    }
    return arr;
  }
  
  let arr = [10, 20, 50, 1, 42, 14, 18];
  console.log(BubbleSort(arr));