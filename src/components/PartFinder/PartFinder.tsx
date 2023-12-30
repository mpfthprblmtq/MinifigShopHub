import React, { FunctionComponent, useEffect, useState } from "react";
import {
  Accordion, AccordionDetails, AccordionSummary,
  AppBar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Menu,
  MenuItem, TextareaAutosize,
  Toolbar, Typography
} from "@mui/material";
import CodeIcon from '@mui/icons-material/Code';
import DataObjectIcon from '@mui/icons-material/DataObject';
import MenuIcon from '@mui/icons-material/Menu';

import xml2js from 'xml2js';
import { colorMap } from "./ColorMap";
import { Part } from "./Part";
import PartRow from "./PartRow";
import { useDispatch, useSelector } from "react-redux";
import { addPartsToStore, removeAllPartsFromStore } from "../../redux/slices/partFinderSlice";
import { Clear } from "@mui/icons-material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InformationDialog from "../_shared/InformationDialog/InformationDialog";

const useXMLFileUpload = () => {

  const dispatch = useDispatch();
  const parts: Part[] = useSelector((state: any) => state.partFinderStore.parts);

  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (files: FileList) => {
    let parsedParts: Part[] = [];
    try {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const xmlContent = event.target?.result;
          if (typeof xmlContent === 'string') {
            const parser = new xml2js.Parser({ explicitArray: false });
            parser.parseString(xmlContent, (err: Error | null, result: any) => {
              if (err) {
                setError('Failed to parse XML');
              } else {
                parsedParts.push(...result.INVENTORY.ITEM.map((xmlItem: any) => {
                  return {
                    id: xmlItem.ITEMID,
                    colorId: xmlItem.COLOR,
                    quantityNeeded: +xmlItem.MINQTY,
                    quantityHave: xmlItem.QTYFILLED ? +xmlItem.QTYFILLED : 0,
                    imageUrl: `https://img.bricklink.com/ItemImage/PN/${xmlItem.COLOR}/${xmlItem.ITEMID}.png`,
                    set: file.name.replace('.xml', '')
                  } as Part;
                }));
                dispatch(addPartsToStore([...parts, ...parsedParts]));
              }
            });
          }
        };

        reader.readAsText(file);
      });

    } catch (err) {
      console.error(err)
      setError('Failed to read file');
    }
  };

  return { parts, error, handleFileUpload };
};

const PartFinder: FunctionComponent = () => {

  const { parts, error, handleFileUpload } = useXMLFileUpload();
  const [showCompletedParts, setShowCompletedParts] = useState<boolean>(false);
  const [colorList, setColorList] = useState<{ id: string, color: string }[]>([]);
  const [colorFilterId, setColorFilterId] = useState<string>();
  const [setList, setSetList] = useState<string[]>([]);
  const [setFilter, setSetFilter] = useState<string>();
  const [jsonDialogOpen, setJsonDialogOpen] = useState<boolean>(false);
  const [json, setJson] = useState<string>('');

  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setColorList(parts.filter(part => {
      if (showCompletedParts) {
        return true;
      } else {
        return part.quantityNeeded !== part.quantityHave;
      }
    }).map(part => {
      return { color: colorMap.get(part.colorId) ?? "", id: part.colorId };
    }).filter(({color, id}, index, self) => self.findIndex(e => color === e.color && id === e.id) === index));

    setSetList(parts.map(part => part.set)
      .filter((value, index, self) => self.findIndex(e => e === value) === index));
  }, [parts]);

  useEffect(() => {
    console.log(colorList.length)
  }, [colorList]);

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      await handleFileUpload(files);
    }
  };

  useEffect(() => {
    setJson(JSON.stringify(parts, null, 2));
  }, [parts]);

  return (
    <>
      <AppBar position={'fixed'}>
        <Toolbar sx={{backgroundColor: '#BBBBBB'}}>
          <IconButton
            onClick={handleClick}
            sx={{position: 'fixed', right: '10px', top: '10px'}}>
            <MenuIcon />
          </IconButton>
          <Menu
            id="demo-positioned-menu"
            aria-labelledby="demo-positioned-button"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            sx={{width: '75%'}}
          >
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Colors</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <MenuItem disabled={!colorFilterId} onClick={() => {
                  if (colorFilterId) {
                    setColorFilterId(undefined);
                    handleClose();
                  }
                }}><strong>Clear Color Filter</strong></MenuItem>
                {colorList.map(color => (
                  <MenuItem key={color.id} onClick={() => {
                    setColorFilterId(color.id);
                    handleClose();
                  }}><Typography noWrap variant={'inherit'}>{color.color}</Typography></MenuItem>
                ))}
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Sets</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <MenuItem disabled={!setFilter} onClick={() => {
                  if (setFilter) {
                    setSetFilter(undefined);
                    handleClose();
                  }
                }}><strong>Clear Set Filter</strong></MenuItem>
                {setList.map((set, index) => (
                  <MenuItem key={index} onClick={() => {
                    setSetFilter(set);
                    handleClose();
                  }}><Typography noWrap variant={'inherit'}>{set}</Typography></MenuItem>
                ))}
              </AccordionDetails>
            </Accordion>
          </Menu>
          <Button
            component="label"
            size={'small'}
            variant="outlined"
            startIcon={<CodeIcon />}
            sx={{ marginRight: "5px" }}
          >
            Upload
            <input type="file" accept=".xml" hidden multiple onChange={onFileChange} />
          </Button>
          <Button
            variant="outlined"
            size={'small'}
            startIcon={<DataObjectIcon />}
            onClick={() => setJsonDialogOpen(true)}
            sx={{marginRight: '5px'}}
          >
            {parts.length === 0 ? 'Upload' : 'Download'}
          </Button>
          <Button
            variant="outlined"
            size={'small'}
            color="error"
            onClick={() => {
              setJson('');
              setColorFilterId(undefined);
              setShowCompletedParts(false);
              dispatch(removeAllPartsFromStore());
            }}
          >
            <Clear />
          </Button>
        </Toolbar>
      </AppBar>
      {parts.length > 0 && (
        <Box sx={{overflowX: 'auto', marginTop: '60px'}}>
          <FormControlLabel
            control={
              <Checkbox
                value={showCompletedParts}
                checked={showCompletedParts}
                onChange={() => {
                  setShowCompletedParts(!showCompletedParts);
                }}
              />
            }
            label={'Show Completed Parts'} />
          {error && <p>{error}</p>}
          {parts.filter(part => {
            if (showCompletedParts) {
              return (colorFilterId ? part.colorId === colorFilterId : true) && (setFilter ? part.set === setFilter : true);
            } else {
              return (colorFilterId ? part.colorId === colorFilterId : true) && (setFilter ? part.set === setFilter : true) && (part.quantityHave !== part.quantityNeeded);
            }
          }).sort((a, b) => a.id.localeCompare(b.id)).map((part, index) => (
            <PartRow part={part} key={index} />
          ))}
        </Box>
      )}
      <InformationDialog
        open={jsonDialogOpen}
        onClose={() => setJsonDialogOpen(false)}
        title={'JSON Parts List'}
        content={
          <Box sx={{overflowX: 'auto'}}>
            <TextareaAutosize
              minRows={10}
              value={json}
              style={{width: '280px'}}
              onChange={event => setJson(event.target.value)}/><br/>
            <Button onClick={() => {
              dispatch(addPartsToStore(JSON.parse(json)))
              setJsonDialogOpen(false);
            }}>
              Load
            </Button>
          </Box>
        } />
    </>
  )
};

export default PartFinder;