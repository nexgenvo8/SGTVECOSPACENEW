import React, {
  useCallback,
  useImperativeHandle,
  useRef,
  forwardRef,
} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import BottomSheet, {BottomSheetView} from '@gorhom/bottom-sheet';

const CommonBottomSheet = forwardRef(({onChange, children}, ref) => {
  const bottomSheetRef = useRef(null);

  useImperativeHandle(ref, () => ({
    open: () => bottomSheetRef.current?.snapToIndex(0),
    close: () => bottomSheetRef.current?.close(),
  }));

  const handleSheetChanges = useCallback(
    index => {
      console.log('Sheet changed to:', index);
      if (onChange) onChange(index);
    },
    [onChange],
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      onChange={handleSheetChanges}
      snapPoints={['50%', '100%']}
      index={-1}
      enablePanDownToClose>
      <BottomSheetView style={{flex: 1, backgroundColor: 'white'}}>
        {children || <Text>Default Content</Text>}
      </BottomSheetView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flexGrow: 1,
  },
});

export default CommonBottomSheet;
