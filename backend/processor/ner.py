from __future__ import annotations
try:
    import spacy
    try:
        _NLP=spacy.load('en_core_web_trf')
    except Exception:
        _NLP=spacy.load('en_core_web_md')
except Exception:
    _NLP=None
def extract_entities(text:str, threshold:float=0.65):
    if not text.strip() or _NLP is None: return {'people':[],'orgs':[],'places':[],'scores':{}}
    doc=_NLP(text[:5000])
    people=list({ent.text for ent in doc.ents if ent.label_=='PERSON'})
    orgs=list({ent.text for ent in doc.ents if ent.label_=='ORG'})
    places=list({ent.text for ent in doc.ents if ent.label_ in ('GPE','LOC')})
    scores={e:1.0 for e in people+orgs+places}
    return {'people':people,'orgs':orgs,'places':places,'scores':scores}
